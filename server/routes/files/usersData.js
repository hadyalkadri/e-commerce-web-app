const bcrypt = require('bcrypt')


const users = {
        "users": [
            {
                "username": "raylan-givins",
                "password": bcrypt.hashSync('justified', 2),
                "admin": true
            },
            {
                "username": "raylan-givins",
                "password": bcrypt.hashSync('hamlet1234', 2),
                "admin": false
            }
        ]
    }
    
    
module.exports = users    