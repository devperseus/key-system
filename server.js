const express = require("express");
const app = express();

app.use(express.json());

let keys = {
    "TEST-123": {
        hwid: null,
        expires: Date.now() + 1000 * 60 * 60 * 24 // 1 day
    }
};

// VERIFY ENDPOINT
app.get("/verify", (req, res) => {
    const { key, hwid } = req.query;

    if (!keys[key]) {
        return res.send("INVALID");
    }

    const data = keys[key];

    // Expiry check
    if (Date.now() > data.expires) {
        return res.send("EXPIRED");
    }

    // First time binding
    if (!data.hwid) {
        data.hwid = hwid;
        return res.send("BOUND");
    }

    // HWID mismatch
    if (data.hwid !== hwid) {
        return res.send("HWID_MISMATCH");
    }

    return res.send("VALID");
});

// SCRIPT ENDPOINT
app.get("/script", (req, res) => {
    res.send(`
        print("Script Loaded Successfully")
        -- your actual script here
    `);
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
