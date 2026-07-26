const fs = require('fs');

let content = fs.readFileSync('src/lib/firebase.ts', 'utf8');

if (!content.includes('import { TelemetryLog }')) {
    content = content.replace(
        'import { State } from "../types";',
        'import { State, TelemetryLog } from "../types";'
    );
}

const telemetryFunc = `
/**
 * Logs an atomic telemetry event to Cloud Firestore asynchronously.
 * This does not block the UI and provides deep analytical insight.
 */
export async function logTelemetryToCloud(log: TelemetryLog): Promise<void> {
  const userId = getDeviceUserId();
  if (userId === "usr_anonymous_device") return; // Optional: skip logging for purely local anonymous without cloud fallback

  try {
    const colRef = collection(db, \`userStates/\${userId}/Kids/\${log.kidId}/TelemetryLogs\`);
    await setDoc(doc(colRef), {
      ...log,
      parentUserId: userId,
      serverTimestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.warn("[Firestore] Falha ao enviar telemetria (background):", err.message);
  }
}
`;

if (!content.includes('logTelemetryToCloud')) {
    content += telemetryFunc;
    fs.writeFileSync('src/lib/firebase.ts', content);
}
