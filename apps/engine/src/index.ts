import { startEngineKafkaConsumer } from "./service/kafkaConsumer.service";
import { getDataFromSnapshot, runSnapshotService } from "./service/snapshot.service";
import { UserStore } from "./Store/UserStore";

const userStore = UserStore.getInstance();

const runEngine = async () => {
  const allUsers = Array.from(userStore.getAllUsers());


  if (allUsers.length <= 0) {
    try {
      await getDataFromSnapshot();
    } catch (err) {
      console.error("Error getting data from snapshot.");
    }
  }


  startEngineKafkaConsumer();
  await runSnapshotService();


}

runEngine();
