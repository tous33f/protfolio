---
title: "Killing the redeploy: dynamic API mappings with SpEL"
slug: dynamic-api-mappings-with-spel
tag: Architecture
date: Jan 2026
order: 1
visible: false
---

# Killing the redeploy

Every financial integration we onboard has its own idea of what a request should look like. One operator wants a flat map of string parameters; the next wants a nested JSON body; a third insists on a very specific field ordering. For a long time we encoded those differences directly in Java — a mapping class per integration, a build, a test run and a deploy for **every** tweak.

The problem was not the code. The problem was the **turnaround**. A single renamed field meant a full CI/CD build-test-deploy cycle of roughly 20 minutes, and it blocked a release train other people were sitting on.

---

## Moving the mapping into configuration

The fix was to stop treating the mapping as code and start treating it as data. We stored each parameter mapping as a row in the database and evaluated it at runtime with Spring Expression Language (SpEL). Instead of a compiled getter, the mapping became an expression string that could reach into the request context and resolve a value on the fly.

```java
// before: hardcoded per integration
request.put("msisdn", ctx.getCustomer().getPhone());

// after: expression stored in config, evaluated at runtime
String expr = mappingRow.getExpression(); // "#customer.phone"
Object value = parser.parseExpression(expr).getValue(context);
```

Now a parameter change is a **config change and a restart** — under 3 minutes — instead of a code change and a redeploy. Application redeployments for this class of change dropped by about 80%.

### What I would watch out for

- Expressions are powerful, so validate and sandbox what they can touch — an expression is effectively code you are storing in a table.
- Cache parsed expressions. Re-parsing the same SpEL string on every request is wasteful; compile once and reuse.
- Give operators clear error messages when an expression fails to resolve, or you just move the debugging pain somewhere less visible.

The broader lesson, in order of importance:

1. The things that change most often should be the cheapest to change.
2. Volatile logic belongs in configuration, not in the compile step.
3. Everything you move out of code, you must now validate as data.

Pushing volatile mapping logic out of the compile step and into configuration was the single biggest turnaround win we shipped that quarter.
