export async function register() {
  // Warm the server-side dataset cache in the background so the first
  // table/profile request doesn't pay the ~186MB JSON.parse cost.
  const { loadDatasetWarm } = await import("@/lib/data-server");
  loadDatasetWarm("singleyr");
  loadDatasetWarm("career");
}
