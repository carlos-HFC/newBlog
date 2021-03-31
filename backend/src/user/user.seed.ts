import { OnSeederInit, Seeder } from "nestjs-sequelize-seeder";

import { User } from "./user.model";

@Seeder({
  model: User,
  unique: ['email', 'nickname'],
  runOnlyIfTableIsEmpty: true
})
export class SeedUser implements OnSeederInit {
  run() {
    return [
      {
        name: "Carlos",
        nickname: "Charlos",
        email: "carlos@email.com",
        role: "author",
        avatar: "GiAmericanFootballBall",
        password: "12345678"
      }
    ]
  }
}