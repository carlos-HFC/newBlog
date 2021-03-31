import { diskStorage } from "multer";
import { resolve } from "path";

export default {
  storage: diskStorage({
    destination: resolve(__dirname, '..', 'uploads'),
    filename(req, file, cb) {
      const fileName = `${Date.now()}__${file.originalname}`

      cb(null, fileName)
    }
  })
}