import { FluxFooter } from "../components";
import { WorldExplorer } from "./world-explorer";

export default function WorldPage() {
  return <main className="world-page">
    <WorldExplorer />
    <FluxFooter />
  </main>;
}
