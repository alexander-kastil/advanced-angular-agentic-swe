- Configure ngx-logger in your application for server-side logging:

  ```typescript
  LoggerModule.forRoot({
    serverLoggingUrl: "http://localhost:3000/logs",
    level: NgxLoggerLevel.DEBUG,
    serverLogLevel: NgxLoggerLevel.ERROR,
  });
  ```

- Inject `NGXLogger` in your components to log messages at different levels:

  ```typescript
  ngxLogger = inject(NGXLogger);

  ngxLogger.debug("Debug message");
  ngxLogger.info("Info message");
  ngxLogger.warn("Warning message");
  ngxLogger.error("Error message");
  ```

- Use the `AILoggerService` as an abstraction layer for application insights and centralized logging
