# SpecPilot AI

SpecPilot AI is the first application of a broader portfolio ecosystem featuring shared authentication, centralized access management, microservice-based applications and cloud deployment.

## Testing Strategy

SpecPilot separates automated CI testing from real OpenAI integration testing.

### Automated CI Tests

- Unit and e2e tests use mocked AI responses.
- GitHub Actions does not require `OPENAI_API_KEY`.
- CI pipelines never perform paid OpenAI API requests.

### Manual OpenAI Smoke Testing

Real OpenAI integration is tested manually during local development using a valid `.env` configuration and local backend execution.
