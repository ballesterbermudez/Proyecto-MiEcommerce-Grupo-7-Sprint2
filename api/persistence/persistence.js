const { Op } = require('sequelize');
const db = require('../database/models')



const persistence = {
  
  searchBYUsername: async (username, password) => {

      try{
          const user = await db.User.findOne({
                           attributes:['id','username'], 
                           where: {username: username, password: password}, 
                           include: { 
                           association: "userrole",
                           attributes: ["role"] }  
                          })
          return user;
      }catch (error)
      {
         throw error
      }

    },

    searchAll: async (modelName) => {
        try{
          const info = await db[modelName].findAll();
          return info
        }catch(error){throw error}

    },

    searchById : async (modelName, id) => {
      try{
        const info = await db[modelName].findByPk(id);
        return info
      }catch(error){throw new Error(error)}

  },

  updateData: async (modelName, id, datos) => {

    try {

          await  db[modelName].update(
            datos,
          {
            where: {id: id}
          })
          

    } catch (error) {
      
      
      throw error
    }

  },

  delete: async (modelName, id) => {

   try {
    
       await db[modelName].destroy({where: {id: id}})

    } catch (error) {
      
     throw error
    }
  },

  

  inster: async (modelName, datos) => {

    try {
      
      const newData = await db[modelName].create(datos);
      return newData

    } catch (error) {
      throw error
    }

  },


  //Criteria es un objeto con las propiedades dentro del findAll

  searchByCriteria: async (modelName, criteria) => {

    try {

      const respuesta = await db[modelName].findAll(criteria);
      return respuesta
  
    } catch (error) {

      throw error
    }
  },

  searchByKeyword: async  (keyWord) => {

    try {
      db.Sequelize.or
      const respuesta = await db.Product.findAll({
        
        include: {
            association: 'category_product',
            attributes: ["title"]
            },
        where: {
          [db.Sequelize.Op.or]: [
            { description: {[db.Sequelize.Op.like] : "%"+keyWord+"%"}},
            {title: {[db.Sequelize.Op.like] : "%"+keyWord+"%"}},
             db.Sequelize.where(db.Sequelize.col('category_product.title'), {[db.Sequelize.Op.like] : "%"+keyWord+"%"}) 
            ],
            
          }
          
    });

      return respuesta
  
    } catch (error) {

      throw error
    }
  },

  getCartByUserID: async (id) => {

    try{
      const cart =  await db.User.findByPk(id, {
        include: {
          model: db.Product,
          as: "cart",
          through: { attributes: ["quantity", "date"] },
          attributes: ["title"],
        },
        //attributes: [db.Sequelize.col('cart')]
        attributes: {exclude: ["email", "password", "username", "first_name", "last_name", "profilepic", "id_role"]}

      })

      return cart;

    }catch(Error){
      throw Error
    }

  },

  //Obtener fotos de un producto

  searchPictureByProduct: async (id) => {

    try {

      const respuesta = await db.Product.findByPk(id, {
        include: {
          association: 'galery'
        },
        attributes: {exclude: ['id','title', 'price', 'description', 'id_category']}
      });
      return respuesta
  
    } catch (error) {

      throw error
    }
  },

}
 


module.exports = persistence;