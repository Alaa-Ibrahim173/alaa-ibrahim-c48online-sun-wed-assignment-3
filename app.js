const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

const PORT = 3000;
////////
app.post("/user", (req, res) => {
    const newUser = req.body;

    fs.readFile("users.json", "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({
                message: "Error reading users file"
            });
        }

        const users = JSON.parse(data);

        const emailExists = users.some(
            user => user.email === newUser.email
        );

        if (emailExists) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        newUser.id =
            users.length > 0
                ? users[users.length - 1].id + 1
                : 1;

        users.push(newUser);

        fs.writeFile(
            "users.json",
            JSON.stringify(users, null, 2),
            err => {
                if (err) {
                    return res.status(500).json({
                        message: "Error writing users file"
                    });
                }

                res.status(201).json({
                    message: "User added successfully",
                    user: newUser
                });
            }
        );
    });
});
////////////
app.patch("/user/:id", (req, res) => {
    const id = Number(req.params.id);

    fs.readFile("users.json", "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({
                message: "Error reading users file"
            });
        }

        const users = JSON.parse(data);

        const user = users.find(user => user.id === id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (req.body.name !== undefined) {
            user.name = req.body.name;
        }

        if (req.body.age !== undefined) {
            user.age = req.body.age;
        }

        if (req.body.email !== undefined) {
            user.email = req.body.email;
        }

        fs.writeFile(
            "users.json",
            JSON.stringify(users, null, 2),
            err => {
                if (err) {
                    return res.status(500).json({
                        message: "Error writing users file"
                    });
                }

                res.json({
                    message: "User updated successfully",
                    user: user
                });
            }
        );
    });
});
////////////
app.delete("/user/:id", (req, res) => {
    const id = Number(req.params.id);

    fs.readFile("users.json", "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({
                message: "Error reading users file"
            });
        }

        const users = JSON.parse(data);

        const userIndex = users.findIndex(
            user => user.id === id
        );

        if (userIndex === -1) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const deletedUser = users[userIndex];

        users.splice(userIndex, 1);

        fs.writeFile(
            "users.json",
            JSON.stringify(users, null, 2),
            err => {
                if (err) {
                    return res.status(500).json({
                        message: "Error writing users file"
                    });
                }

                res.json({
                    message: "User deleted successfully",
                    user: deletedUser
                });
            }
        );
    });
});
/////////////
app.get("/user/getByName", (req, res) => {
    const name = req.query.name;

    fs.readFile("users.json", "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({
                message: "Error reading users file"
            });
        }

        const users = JSON.parse(data);

        const user = users.find(
            user => user.name.toLowerCase() === name.toLowerCase()
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user);
    });
});
///////////////
app.get("/user", (req, res) => {
    fs.readFile("users.json", "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({
                message: "Error reading users file"
            });
        }

        const users = JSON.parse(data);

        res.json(users);
    });
});
/////////////
app.get("/user/filter", (req, res) => {
    const minAge = Number(req.query.minAge);

    fs.readFile("users.json", "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({
                message: "Error reading users file"
            });
        }

        const users = JSON.parse(data);

        const filteredUsers = users.filter(
            user => user.age >= minAge
        );

        res.json(filteredUsers);
    });
});
/////////////////
app.get("/user/:id", (req, res) => {
    const id = Number(req.params.id);

    fs.readFile("users.json", "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({
                message: "Error reading users file"
            });
        }

        const users = JSON.parse(data);

        const user = users.find(
            user => user.id === id
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user);
    });
});
//////////////////////////////
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});