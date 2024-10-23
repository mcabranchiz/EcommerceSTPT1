const services = require('./productos.service');
const { cloudinary, upload } = require('../config/cloudinary');
const Producto = require('./productos.model');
const ImagenProducto = require('./imagen_producto.model');

const createController = async (req, res) => {
  try {
    const producto = req.body;
    const newProducto = await services.create(producto);
    res.status(201).json(newProducto);
  } catch (error) {
    res.status(400).json(error);
  }
};

const findAllController = async (req, res) => {
  try {
    const productos = await services.findAll();
    res.status(200).json(productos);
  } catch (error) {
    res.status(400).json(error);
  }
};

const findByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await services.findById(id);
    res.status(200).json(producto);
  } catch (error) {
    res.status(400).json(error);
  }
};

const updateController = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const producto = req.body;
    const updatedProducto = await services.update(id, producto);
    res.status(200).json(updatedProducto);
  } catch (error) {
    res.status(400).json(error);
  }
};

const removeController = async (req, res) => {
  try {
    const { id } = req.params;
    const row_affected = await services.remove(id);
    if (row_affected === 0) {
      return res.status(404).json({ message: `Producto con id ${id} no encontrado` });
    }
    res.status(200).json({ message: `Producto con id ${id} eliminado` });
  } catch (error) {
    res.status(400).json(error);
  }
};




const uploadProductImage = async (req, res) => {
  try {
    const { id_producto } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: 'No se ha proporcionado una imagen' });
    }

    // Guardar la URL de la imagen en la tabla `imagen_producto`
    const imageUrl = req.file.path;

    const imagenProducto = await ImagenProducto.create({
      id_producto,
      url: imageUrl,
    });

    res.status(200).json({ message: 'Imagen subida exitosamente', imagen: imagenProducto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al subir la imagen', error });
  }
};



const deleteProductImage = async (req, res) => {
  try {
    const { id_imagen_producto } = req.params;

    // Buscar la imagen en la base de datos
    const imagenProducto = await ImagenProducto.findByPk(id_imagen_producto);

    if (!imagenProducto) {
      return res.status(404).json({ message: 'Imagen no encontrada' });
    }

    // Eliminar la imagen de Cloudinary
    const publicId = imagenProducto.url.split('/').pop().split('.')[0]; // Obtener el public_id de Cloudinary
    await cloudinary.uploader.destroy(publicId);

    // Eliminar la referencia en la base de datos
    await imagenProducto.destroy();

    res.status(200).json({ message: 'Imagen eliminada exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la imagen', error });
  }
};




module.exports = {
  createController,
  findAllController,
  findByIdController,
  updateController,
  removeController,
  uploadProductImage,
  deleteProductImage
};