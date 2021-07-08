import { Handlers, init, Integrations } from "@sentry/node"
import * as Tracing from "@sentry/tracing"
import { Application } from "express"
import config from "../../config/Index"

const sentryTracker = (app: Application) => {
  init({
    dsn: config.sentry.dsn,
    integrations: [
      new Integrations.Http({ tracing: true }),
      new Tracing.Integrations.Express({ app }),
      new Tracing.Integrations.Mongo(),
    ],

    tracesSampleRate: Number(config.sentry.tracesSampleRate),
  })

  app.use(
    Handlers.requestHandler({
      request: true,
      serverName: true,
      user: ["id", "email"],
    })
  )

  app.use(Handlers.tracingHandler())
}

const sentryTrackerErrorHandler = (app: Application) => {
  app.use(
    Handlers.errorHandler({
      shouldHandleError() {
        return true
      },
    })
  )
}

export { sentryTracker, sentryTrackerErrorHandler }
