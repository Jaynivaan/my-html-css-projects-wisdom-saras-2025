// core js orchestrator
import { initGenesis }   from "./modules/reflectionGenesis.js";
import { initChurn }     from "./modules/reflectionChurn.js";
import { initStillness } from "./modules/reflectionStillness.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("[boot] DOM ready");

  try { 
    console.log("[boot] initGenesis ->");
    initGenesis();
    console.log("[boot] initGenesis ✓");
  } catch (e) {
    console.error("[boot] initGenesis ✗", e);
  }

  try { 
    console.log("[boot] initChurn ->");
    initChurn();
    console.log("[boot] initChurn ✓");
  } catch (e) {
    console.error("[boot] initChurn ✗", e);
  }

  try { 
    console.log("[boot] initStillness ->");
    initStillness();
    console.log("[boot] initStillness ✓");
  } catch (e) {
    console.error("[boot] initStillness ✗", e);
  }
});
