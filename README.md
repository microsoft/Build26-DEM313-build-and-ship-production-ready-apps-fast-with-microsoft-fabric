<a name="start-building"></a>
<br>
<p align="center">
<img src="img/banner-build-26.png" alt="Microsoft Build 2026" width="1200"/>
</p>

# [Microsoft Build 2026](https://build.microsoft.com)

## 🔥 DEM313: Building and Ship Production-Ready Apps Fast with Rayfin and Microsoft Fabric

### Session Description

See how to build and ship a production-ready field technician app using Rayfin and Microsoft Fabric. Walk through a real-world field technician scenario — adding authentication, data persistence with role-based access policies, job management, and customer tracking — then deploy to Fabric, all without managing backend infrastructure.

### 🚀 Getting started

To get started with this demo:

**Prerequisites:**
- [Node.js](https://nodejs.org/) 20+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for local development)
- [GitHub CLI](https://cli.github.com/) authenticated with `read:packages` scope (for pulling container images)

**Steps:**

1. Clone this repository and navigate to the app:

   ```bash
   git clone https://github.com/microsoft/Build26-DEM313-build-and-ship-production-ready-apps-fast-with-microsoft-fabric.git
   cd Build26-DEM313-build-and-ship-production-ready-apps-fast-with-microsoft-fabric/src
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start local development (runs the full Rayfin backend in Docker — no Fabric workspace needed):

   ```bash
   npm run dev:local
   ```

   Or, to deploy to a Fabric workspace and start the dev server:

   ```bash
   npm run dev
   ```

4. Open your browser to the URL shown in the terminal.

**Additional scripts:**

| Script | Description |
| --- | --- |
| `npm run dev` | Deploy to Fabric and start Vite dev server |
| `npm run dev:local` | Start Docker backend and Vite dev server |
| `npm run dev:local:stop` | Stop local Docker containers (keeps data) |
| `npm run dev:local:down` | Remove local Docker containers (keeps volumes) |
| `npm run dev:local:purge` | Purge containers and volumes (full reset) |
| `npm run build` | Type-check and build for production |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests with Vitest |

### 🧠 Learning Outcomes

By the end of this demo, you will be able to:

- Scaffold a production-ready React app with Rayfin and deploy it to Microsoft Fabric
- Add authentication with dual sign-in support (local username/password and Fabric Entra)
- Define data entities with role-based access policies using Rayfin decorators
- Build a service layer for job management, customer tracking, and user profiles
- Use GitHub Copilot to add new features and debug issues in your app

### 💬 Keep Learning with Copilot

Try these prompts with GitHub Copilot to explore the topics from this demo. Open Copilot Chat in Visual Studio Code (`Ctrl+Alt+I` on Windows/Linux, `Cmd+Shift+I` on Mac), paste a prompt, and see what you learn. Try connecting the [Microsoft Learn MCP Server](#-microsoft-learn-mcp-server) for the latest official documentation.

Use these as a starting point — or write your own!

1. Understand Rayfin data modeling:

```
Explain how Rayfin decorators like @entity(), @role(), @uuid(), and @text() work to define data entities with access control policies. Show me an example of a role-based policy that restricts data to the authenticated user.
```

2. Explore authentication patterns:

```
Using the Microsoft Learn MCP Server, find the latest documentation on Microsoft Fabric Entra authentication. Then explain how this demo app supports both local username/password and Fabric Entra sign-in using the builder pattern in RayfinAuthService.
```

3. Build on the demo:

```
Help me add a new "Equipment" management page to this field technician app. It should list equipment assigned to the current user, allow marking items as serviced, and use the existing Rayfin service layer pattern for data access.
```

### 💻 Technologies Used

1. [Rayfin](https://aka.ms/rayfin)
1. [Microsoft Fabric](https://learn.microsoft.com/fabric/)
1. [GitHub Copilot](https://github.com/features/copilot)
1. [React](https://react.dev/) with TypeScript
1. [Radix UI](https://www.radix-ui.com/) with Tailwind CSS

### 📚 Resources and Next Steps

| Resource | Description |
|:---------|:------------|
| [Rayfin documentation](https://aka.ms/rayfin) | Official docs for building apps with Rayfin |
| [Microsoft Fabric documentation](https://learn.microsoft.com/fabric/) | Microsoft Fabric product documentation |
| [LAB514: Ship AI apps fast with a managed backend in Microsoft Fabric](https://github.com/microsoft/Build26-LAB514-ship-ai-apps-fast-with-a-managed-backend-in-microsoft-fabric) | Related hands-on lab for building apps with Rayfin and Microsoft Fabric |
| [https://aka.ms/build26-next-steps](https://aka.ms/build26-next-steps) | Explore lab and demo repos to further your learning from Microsoft Build |


### 🌟 Microsoft Learn MCP Server

The Microsoft Learn MCP Server gives your AI agent direct access to Microsoft's official documentation — grounded, up-to-date answers about the products and services covered in this demo.

**Visual Studio Code** — One click installation: 

[![Install in VS Code](https://img.shields.io/badge/VS_Code-Install_Microsoft_Learn_MCP-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect/mcp/install?name=microsoft-learn&config=%7B%22type%22%3A%22http%22%2C%22url%22%3A%22https%3A%2F%2Flearn.microsoft.com%2Fapi%2Fmcp%22%7D)


**GitHub Copilot CLI** — Run this to install the Learn MCP Server as a plugin:
```
/plugin install microsoftdocs/mcp
```

For more info, other clients, and to post questions, visit the [Learn MCP Server repo](https://aka.ms/learnmcp).

## Content Owners

<table>
<tr>
    <td align="center"><a href="https://github.com/christopheranderson">
        <img src="https://github.com/christopheranderson.png" width="100px;" alt="Chris Anderson"/><br />
        <sub><b>Chris Anderson</b></sub></a><br />
            <a href="https://github.com/christopheranderson" title="talk">📢</a>
    </td>
</tr></table>

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit [Contributor License Agreements](https://cla.opensource.microsoft.com).

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.
