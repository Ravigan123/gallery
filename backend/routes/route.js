const express = require("express");
const router = express.Router();
const DataController = require("../controllers/DataController");
const DeviceController = require("../controllers/DeviceController");
const LocationController = require("../controllers/LocationController");
const TypeController = require("../controllers/TypeController");
const AlertController = require("../controllers/AlertController");
const ReceiverController = require("../controllers/ReceiverController");
const SenderController = require("../controllers/SenderController");

router.get("/data", DataController.getDataToDashboard);
// router.get("/store", DataController.translateData);
router.post("/take/data", DataController.takeData);
router.delete("/:id", DataController.deleteData);

router.get("/type", TypeController.getAllTypes);
router.get("/typeSelect", TypeController.getTypesToSelect);

router.get("/device", DeviceController.getAllDevices);
router.get("/deviceSelect", DeviceController.getDevicesToSelect);
router.post("/device/", DeviceController.storeDevice);
router.put("/device/:id", DeviceController.updateDevice);
router.delete("/device/:id", DeviceController.deleteDevice);

router.get("/location", LocationController.getAllLocations);
router.get("/getLocationSelect", LocationController.getLocationsToSelect);
router.post("/location/", LocationController.storeLocation);
router.put("/location/:id", LocationController.updateLocation);
router.delete("/location/:id", LocationController.deleteLocation);

router.get("/receiver", ReceiverController.getAllReceivers);
router.get("/receiverDetails/:id", ReceiverController.getReceiverDetails);
router.post("/receiverDetails/", ReceiverController.storeReceiverDetails);
router.delete("/receiverDetails/:id", ReceiverController.deleteReceiverDetails);
router.post("/receiver/", ReceiverController.storeReceiver);
router.put("/receiver/:id", ReceiverController.updateReceiver);
router.delete("/receiver/:id", ReceiverController.deleteReceiver);

router.get("/alert", AlertController.getAllAlerts);
router.get("/alertType", AlertController.getAlertType);
router.put("/alert/:id", AlertController.doneAlert);

router.post("/sender", SenderController.storeSender);
router.get("/sender", SenderController.getAllSenders);
router.put("/sender/:id", SenderController.updateSender);
router.delete("/sender/:id", SenderController.deleteSender);

module.exports = router;
