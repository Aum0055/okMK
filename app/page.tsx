import DialogDetailEdit from "./components/dialogDeailEdit";
import { DialogDetail } from "./components/dialogDetail";
import { DialogDowntime } from "./components/dialogDowntime";
import SimpleDialogDemo from "./components/dialogNg";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center  p-24">
      {/* <SimpleDialogDemo /> */}
      {/* <DialogDetail idWorkOrder="2307003s71" /> */}
      {/* <DialogDetailEdit idWorkOrder="2307003s71" /> */}
      <DialogDowntime/>
    </main>
  );
}
