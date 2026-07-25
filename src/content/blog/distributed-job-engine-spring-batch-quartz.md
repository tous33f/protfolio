---
title: "A distributed job engine with Spring Batch & Quartz"
slug: distributed-job-engine-spring-batch-quartz
tag: Backend
date: Dec 2025
order: 2
visible: false
---

# A distributed job engine

A lot of our integrations are sequential and dependent: step B needs the output of step A, step C fires a callback once B settles. Doing that inline inside a request thread is fragile — one slow external API and the whole chain times out with no way to resume.

So we built a distributed background job-processing engine to own that work: **orchestration, retries, notifications and observability** in one place.

---

## The pieces

- **Spring Batch** for chunked, multithreaded execution of large jobs.
- **Quartz Scheduler** for time-based and recurring triggers, with clustering so any node can pick up work.
- A small workflow layer describing the ordered steps and what each one depends on.
- Configurable retry policies and callback notifications per step.

## Why orchestration mattered

The value was not any single library — it was making the dependency graph **explicit**. Once each step declared its inputs and its retry behavior, failures stopped being catastrophic. A step could fail, back off, retry and then continue the chain, and we could see exactly where a job was stuck instead of guessing from logs.

```java
Step notify = stepBuilder.chunk(50, tx)
    .reader(pendingReader)
    .processor(callbackProcessor)
    .writer(dispatchWriter)
    .faultTolerant()
    .retryLimit(3)
    .retry(TransientApiException.class)
    .build();
```

Observability was a first-class requirement, not an afterthought. Every job carries enough context to answer *"what ran, what failed, and what is it waiting on?"* without attaching a debugger to production.

### Takeaways

1. Make dependencies between steps explicit and data-driven — it turns a tangle into something you can reason about.
2. Retries need to be configurable per step; a payment callback and a report export do not want the same policy.
3. If you cannot see a job's state at a glance, you do not really have a job engine — you have a queue with extra steps.
