---
title: "Onboarding 250,000 merchants without losing your mind"
slug: onboarding-250k-merchants
tag: Case study
date: Nov 2025
order: 3
visible: false
---

# Onboarding 250,000 merchants

Migrating merchants off a legacy platform is the kind of task that looks like a spreadsheet import and turns out to be a distributed-systems problem. For **Tanzania** and **Togo** we needed to move 250,000+ merchants, and doing it one-by-one through the normal onboarding flow would have taken a small eternity.

---

## Dynamic upload templates

Different markets carry different fields and different KYC requirements. Rather than hardcode a schema per country, the pipeline reads a **dynamic upload template** that describes the expected columns and validation rules, so onboarding a new market is a configuration exercise, not a code change.

## Bulk KYC validation

KYC documents were validated in bulk instead of per-merchant round trips. Batching the validation and failing fast on bad rows kept the throughput high without letting invalid data slip through.

The combined effect: per-merchant onboarding dropped from around **5 minutes to under 1**, and a migration that would have been measured in weeks became something we could actually run and re-run.

### Lessons

1. Treat the schema as data. The moment a second market appears, any hardcoded field list becomes a liability.
2. Validate in bulk and report failures as a set, so an operator can fix a batch instead of chasing one error at a time.
3. Make the migration idempotent and re-runnable — you will run it more than once, guaranteed.
