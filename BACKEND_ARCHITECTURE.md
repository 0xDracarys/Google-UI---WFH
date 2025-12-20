
# WorkflowHub Architect: Google-Grade Backend Specification

## 🛠 Vision
To build a globally scalable, low-latency automation control plane that bridges Gemini’s generative capabilities with n8n’s execution power. This system is designed following Google’s "Infrastructure as Code" and "Site Reliability Engineering" principles.

---

## 🏗 System Components

### 1. The Gateway (Cloud Endpoints / Apigee)
- **Responsibility**: Rate limiting, authentication (Google Cloud IAM), and protocol translation (gRPC-Web for the frontend).
- **Tech Stack**: Envoy proxy based.

### 2. Gemini Orchestrator (Cloud Run / Go)
- **Responsibility**: Manages the "Thought Loop."
- **Logic**:
  - **Prompt Sanitization**: Ensures user input doesn't violate safety guidelines.
  - **Context Hydration**: Injects current workflow state into the LLM context window.
  - **JSON Serialization**: Parses Gemini's output into the `WorkflowState` protobuf.

### 3. Sync Plane (Firestore + WebSockets)
- **Responsibility**: Real-time multi-user collaboration.
- **Tech Stack**:
  - **Firestore**: For document-based state persistence.
  - **Cloud Pub/Sub**: For broadcasting changes across server instances.
  - **Socket.io on GKE**: For persistent socket connections.

### 4. n8n Execution Connector (Cloud Functions)
- **Responsibility**: Translating "Sketches" into "Workflows."
- **Process**:
  - **Mapping**: Converts `WorkflowNode.service` to n8n node IDs via a lookup table.
  - **Validation**: Performs dry-runs against the n8n API.
  - **Deployment**: Triggers the `POST /workflows` endpoint on the private n8n cluster.

---

## 📊 Data Model (Protobuf)

```protobuf
message Node {
  string id = 1;
  enum Type { TRIGGER = 0; ACTION = 1; }
  Type node_type = 2;
  string service_identity = 3;
  string action_label = 4;
  Position pos = 5;
}

message Workflow {
  string uuid = 1;
  repeated Node nodes = 2;
  repeated Edge edges = 3;
  string owner_id = 4;
}
```

---

## 🚀 Deployment Strategy
1. **Regional Expansion**: Deploy backend services in `us-central1`, `europe-west1`, and `asia-northeast1` to minimize latency for global architects.
2. **Secret Management**: Use **Google Secret Manager** to store n8n API keys and service credentials, ensuring the LLM never sees raw secrets.
3. **Observability**: **Cloud Monitoring (Stackdriver)** for real-time error tracking and latency histograms on Gemini response times.

---

## 🛡 Security Guardrails
- **Grounding Check**: Before a workflow is pushed to n8n, a secondary "Verifier" AI check ensures the logic doesn't perform destructive actions without explicit user confirmation.
- **Tenant Isolation**: Each user project runs in an isolated Firestore namespace.
