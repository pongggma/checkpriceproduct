import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [image, setImage] = useState(null)
  const [products, setProducts] = useState([])
  const [editId, setEditId] = useState(null)

  // LOAD FROM LOCALSTORAGE
  useEffect(() => {
    const storedProducts = localStorage.getItem("products")
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts))
    }
  }, [])

  // SAVE TO LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products))
  }, [products])

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setImage(URL.createObjectURL(file))
  }

  function handleSubmit() {
    if (!name || !price || !image) return

    if (editId) {
      setProducts(products.map(p =>
        p.id === editId ? { ...p, name, price, image } : p
      ))
      setEditId(null)
    } else {
      setProducts([
        ...products,
        { id: Date.now(), name, price, image }
      ])
    }

    setName("")
    setPrice("")
    setImage(null)
  }

  function handleEdit(product) {
    setName(product.name)
    setPrice(product.price)
    setImage(product.image)
    setEditId(product.id)
  }

  function handleDelete(id) {
    setProducts(products.filter(p => p.id !== id))
  }

  return (
    <div className='app'>

      <div className='inpuut'>
        <h2>{editId ? "Edit Product" : "Add Product"}</h2>

        <input
          className='text'
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          className='text'
          placeholder="Price"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />

        <input
          type="file"
          id="upload"
          accept="image/*"
          onChange={handleImageChange}
          hidden
        />
        <label htmlFor="upload" className="upload-btn">
          📷 Choose Image
        </label>

        {image && <img className="preview-img" src={image} />}

        <button className='submit-btn' onClick={handleSubmit}>
          {editId ? "Update" : "Submit"}
        </button>
      </div>

      <div className="card">
        <h2>Product Preview</h2>

        {products.map(product => (
          <div className="product" key={product.id}>
            <p>{product.name}</p>
            <p>{product.price}</p>
            <img className="pic" src={product.image} width="150" />

            <button className="submit-btn" onClick={() => handleEdit(product)}>✏️Edit</button>
            <button className="submit-btn" onClick={() => handleDelete(product.id)}> 🗑 Delete</button>
          </div>
        ))}
      </div>

    </div>
  )
}

export default App
