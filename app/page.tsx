import { DialogDetail } from "./components/dialogDetail";
import SimpleDialogDemo from "./components/dialogNg";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center  p-24">
      {/* <SimpleDialogDemo /> */}
      <DialogDetail idWorkOrder="2307003s71" />
    </main>
  );
}
