// Central content source for the portfolio — populated from Muhammad Touseef's resume.

export const profile = {
  name: 'Muhammad Touseef',
  firstName: 'Touseef',
  role: 'Backend Software Engineer',
  tagline: 'Backend Software Engineer',
  location: 'Pakistan',
  blurb:
    'I build scalable, configuration-driven backend systems for multi-operator financial platforms — turning hardcoded, slow-to-change processes into dynamic, observable services.',
  shortBio:
    'Associate Software Engineer at Paysys Labs. I design workflow automation, job-processing engines and integration layers with Java & Spring Boot, obsessing over making systems faster to run and easier to change.',
  email: 'touseefnaveed777@gmail.com',
  phone: '(+92) 311-1441081',
  resumeUrl: '/Muhammad-Touseef-Resume.pdf',
  socials: {
    github: 'https://github.com/tous33f',
    linkedin: 'https://www.linkedin.com/in/muhammad7touseef',
    email: 'mailto:touseefnaveed777@gmail.com',
  },
}

export const stats = [
  { value: '250K+', label: 'Merchants migrated' },
  { value: '75%', label: 'Faster execution' },
  { value: '95%', label: 'Test coverage' },
  { value: '10+', label: 'Notification types' },
]

export const experience = [
  {
    company: 'Paysys Labs',
    companyUrl: 'https://www.linkedin.com/company/paysys-labs',
    role: 'Associate Software Engineer',
    mode: 'Onsite',
    period: 'Oct 2025 — Present',
    current: true,
    points: [
      'Designed a configurable business workflow automation system for multi-operator financial authorizations, reducing execution time by 75% (800ms → 200ms) by replacing variable-based request processing with JSON payloads.',
      'Replaced hardcoded API integration mappings with dynamic configuration using Spring Expression Language, cutting per-parameter update turnaround from ~20 minutes to under 3 minutes and reducing application redeployments by 80%.',
      'Implemented a dynamic external-API error-handling mechanism using database-configured JSON paths, reducing generic UI errors from ~90% to ~5% while eliminating code changes for varying response structures.',
      'Developed a bulk merchant onboarding pipeline for Tanzania & Togo, enabling migration of 250,000+ merchants from legacy platforms and reducing per-merchant onboarding from 5 minutes to under 1 minute.',
      'Architected a distributed background job-processing engine using Spring Batch & Quartz Scheduler with workflow orchestration, configurable retries, callback notifications and multithreaded batch execution.',
      'Automated external-API configuration in an internal middleware service, generating structured queries across 7+ interdependent tables and reducing configuration time by 90%.',
      'Built a configurable, template-driven notification service supporting 10+ notification types across 3+ delivery channels.',
    ],
  },
  {
    company: 'Paysys Labs',
    companyUrl: 'https://www.linkedin.com/company/paysys-labs',
    role: 'Software Engineer Intern',
    mode: 'Onsite',
    period: 'Jun 2025 — Sep 2025',
    current: false,
    points: [
      'Designed an automated WhatsApp-driven incident management system that captured issue details, created JIRA tickets and assigned operations engineers through round-robin scheduling, reducing manual effort and reporting delays for field sales teams.',
      'Wrote unit tests for 60+ backend services using Mockito & JUnit across multiple applications, achieving ~95% code coverage to improve reliability and support refactoring.',
    ],
  },
]

export const projects = [
  {
    name: 'Incident Reporting System',
    url: 'https://github.com/tous33f/issue-tracker',
    stack: ['NodeJS', 'ExpressJS', 'ReactJS', 'SQLite'],
    description:
      'A WhatsApp-based incident management system that collects structured issue details, automatically creates tickets, assigns requests using round-robin shift scheduling and standardizes reporting for faster processing.',
  },
  {
    name: 'Kollege',
    url: 'https://github.com/tous33f/Kollege',
    stack: ['NodeJS', 'ExpressJS', 'ReactJS', 'MySQL'],
    description:
      'A standalone learning platform integrating course delivery, discussion forums, live calls and community management in a single place — removing the need to juggle Udemy, Discord and Reddit.',
  },
]

export const skills = [
  {
    group: 'Languages',
    items: ['Java', 'C#', 'JavaScript / TypeScript', 'Python', 'SQL'],
  },
  {
    group: 'Libraries & Frameworks',
    items: [
      'Spring Boot',
      '.NET',
      'Spring Data JPA',
      'Spring Security',
      'ReactJS',
      'NestJS',
      'NodeJS',
      'ExpressJS',
    ],
  },
  {
    group: 'DevOps & Cloud',
    items: [
      'Docker',
      'Docker Compose',
      'AWS EC2',
      'AWS VPC',
      'AWS Route53',
      'AWS Load Balancer',
      'Railway',
      'Vercel',
    ],
  },
  {
    group: 'Databases',
    items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Microsoft SQL Server'],
  },
  {
    group: 'Productivity',
    items: [
      'Git',
      'Linux (Arch / Debian)',
      'Bash',
      'Markdown',
      'LaTeX',
      'Jupyter',
      'Selenium',
    ],
  },
]

export const education = [
  {
    school: 'FAST NUCES',
    degree: 'Bachelor of Science in Computer Science',
    period: '2022 — 2026',
    detail: 'GPA: 3.44 / 4.00',
  },
]

export const posts = [
  {
    slug: 'dynamic-api-mappings-with-spel',
    title: 'Killing the redeploy: dynamic API mappings with SpEL',
    excerpt:
      'How replacing hardcoded integration mappings with Spring Expression Language cut our per-parameter turnaround from ~20 minutes to under 3, and dropped redeployments by 80%.',
    date: 'Jan 2026',
    tag: 'Architecture',
    readTime: '6 min read',
    content: [
      {
        p: 'Every financial integration we onboard has its own idea of what a request should look like. One operator wants a flat map of string parameters; the next wants a nested JSON body; a third insists on a very specific field ordering. For a long time we encoded those differences directly in Java — a mapping class per integration, a build, a test run and a deploy for every tweak.',
      },
      {
        p: 'The problem was not the code. The problem was the turnaround. A single renamed field meant a full CI/CD build-test-deploy cycle of roughly 20 minutes, and it blocked a release train that other people were sitting on.',
      },
      { h: 'Moving the mapping into configuration' },
      {
        p: 'The fix was to stop treating the mapping as code and start treating it as data. We stored each parameter mapping as a row in the database and evaluated it at runtime with Spring Expression Language (SpEL). Instead of a compiled getter, the mapping became an expression string that could reach into the request context and resolve a value on the fly.',
      },
      {
        code: "// before: hardcoded per integration\nrequest.put(\"msisdn\", ctx.getCustomer().getPhone());\n\n// after: expression stored in config, evaluated at runtime\nString expr = mappingRow.getExpression(); // \"#customer.phone\"\nObject value = parser.parseExpression(expr).getValue(context);",
      },
      {
        p: 'Now a parameter change is a config change and a restart — under 3 minutes — instead of a code change and a redeploy. Application redeployments for this class of change dropped by about 80%.',
      },
      { h: 'What I would watch out for' },
      {
        ul: [
          'Expressions are powerful, so validate and sandbox what they can touch — an expression is effectively code you are storing in a table.',
          'Cache parsed expressions. Re-parsing the same SpEL string on every request is wasteful; compile once and reuse.',
          'Give operators clear error messages when an expression fails to resolve, or you just move the debugging pain somewhere less visible.',
        ],
      },
      {
        p: 'The broader lesson: the things that change most often should be the things that are cheapest to change. Pushing volatile mapping logic out of the compile step and into configuration was the single biggest turnaround win we shipped that quarter.',
      },
    ],
  },
  {
    slug: 'distributed-job-engine-spring-batch-quartz',
    title: 'A distributed job engine with Spring Batch & Quartz',
    excerpt:
      'Designing a background processing engine with workflow orchestration, configurable retries, callbacks and multithreaded batch execution for dependent API integrations.',
    date: 'Dec 2025',
    tag: 'Backend',
    readTime: '8 min read',
    content: [
      {
        p: 'A lot of our integrations are sequential and dependent: step B needs the output of step A, step C fires a callback once B settles. Doing that inline inside a request thread is fragile — one slow external API and the whole chain times out with no way to resume.',
      },
      {
        p: 'So we built a distributed background job-processing engine to own that work: orchestration, retries, notifications and observability in one place.',
      },
      { h: 'The pieces' },
      {
        ul: [
          'Spring Batch for chunked, multithreaded execution of large jobs.',
          'Quartz Scheduler for time-based and recurring triggers, with clustering so any node can pick up work.',
          'A small workflow layer describing the ordered steps and what each one depends on.',
          'Configurable retry policies and callback notifications per step.',
        ],
      },
      { h: 'Why orchestration mattered' },
      {
        p: 'The value was not any single library — it was making the dependency graph explicit. Once each step declared its inputs and its retry behavior, failures stopped being catastrophic. A step could fail, back off, retry and then continue the chain, and we could see exactly where a job was stuck instead of guessing from logs.',
      },
      {
        p: 'Observability was a first-class requirement, not an afterthought. Every job carries enough context to answer “what ran, what failed, and what is it waiting on?” without attaching a debugger to production.',
      },
      { h: 'Takeaways' },
      {
        ul: [
          'Make dependencies between steps explicit and data-driven — it turns a tangle into something you can reason about.',
          'Retries need to be configurable per step; a payment callback and a report export do not want the same policy.',
          'If you cannot see a job’s state at a glance, you do not really have a job engine — you have a queue with extra steps.',
        ],
      },
    ],
  },
  {
    slug: 'onboarding-250k-merchants',
    title: 'Onboarding 250,000 merchants without losing your mind',
    excerpt:
      'Lessons from building a bulk merchant onboarding pipeline for Tanzania & Togo — dynamic upload templates, bulk KYC validation and going from 5 minutes to under 1.',
    date: 'Nov 2025',
    tag: 'Case study',
    readTime: '5 min read',
    content: [
      {
        p: 'Migrating merchants off a legacy platform is the kind of task that looks like a spreadsheet import and turns out to be a distributed-systems problem. For Tanzania and Togo we needed to move 250,000+ merchants, and doing it one-by-one through the normal onboarding flow would have taken a small eternity.',
      },
      { h: 'Dynamic upload templates' },
      {
        p: 'Different markets carry different fields and different KYC requirements. Rather than hardcode a schema per country, the pipeline reads a dynamic upload template that describes the expected columns and validation rules, so onboarding a new market is a configuration exercise, not a code change.',
      },
      { h: 'Bulk KYC validation' },
      {
        p: 'KYC documents were validated in bulk instead of per-merchant round trips. Batching the validation and failing fast on bad rows kept the throughput high without letting invalid data slip through.',
      },
      {
        p: 'The combined effect: per-merchant onboarding dropped from around 5 minutes to under 1, and a migration that would have been measured in weeks became something we could actually run and re-run.',
      },
      { h: 'Lessons' },
      {
        ul: [
          'Treat the schema as data. The moment a second market appears, any hardcoded field list becomes a liability.',
          'Validate in bulk and report failures as a set, so an operator can fix a batch instead of chasing one error at a time.',
          'Make the migration idempotent and re-runnable — you will run it more than once, guaranteed.',
        ],
      },
    ],
  },
]

export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Work', to: '/work' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
]
