const express = require("express");
const router = express.Router();

const Address = require("../models/address");

router.post("/addaddress", async (req, res) => {
    try {
      const newAddress = new Address(req.body);
      const address = await newAddress.save();
  
      res.send("New address added successfully..!");
    } catch (error) {
      console.error('Error adding address:', error);
      return res.status(400).json({ message: error.message });
    }
  });

  router.get("/getaddress/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        // Find all addresses associated with the given user ID
        const addresses = await Address.find({ userid: userId });
        res.json(addresses);
    } catch (error) {
        console.error('Error fetching user address:', error);
        return res.status(400).json({ message: error.message });
    }
});

router.post("/getalladdress", async (req, res) => {
  try {
    const addresses = await Address.find();
    res.send(addresses);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const addId = req.params.id;
    const address = await Address.findById(addId);
    
    if (!address) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.send(address);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE endpoint to delete an address by ID
router.delete('/remove/:id', async (req, res) => {
  try {
    // Extract the address ID from the request parameters
    const addressId = req.params.id;

    // Find the address in the database by its ID and delete it
    const deletedAddress = await Address.findByIdAndDelete(addressId);

    // Check if the address was found and deleted
    if (!deletedAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // Respond with a success message
    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    // Handle errors
    console.error('Error deleting address:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    // Extract the address ID from the request parameters
    const addressId = req.params.id;

    // Find the address in the database by its ID and update it
    const updatedAddress = await Address.findByIdAndUpdate(addressId, req.body, { new: true });

    // Check if the address was found and updated
    if (!updatedAddress) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // Respond with the updated address
    res.status(200).json(updatedAddress);
  } catch (error) {
    // Handle errors
    console.error('Error updating address:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;