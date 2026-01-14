const express = require('express')
const productController = require('../controllers/productController')
const verifyToken = require('../midlewares/verifyToken');
const router = express.Router();

router.post('/add-product/:firmId', verifyToken, productController.upload.single('image'), productController.addProduct);

router.get('/:firmId/products', productController.getProductByFirm)

// Image serving is handled by app.use('/uploads', express.static('uploads'))

router.delete('/:productId', productController.deleteProductById);

module.exports = router;


