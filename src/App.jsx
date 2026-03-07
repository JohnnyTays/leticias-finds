import { useState, useEffect } from 'react'
import './App.css'

// Sample initial inventory
const initialInventory = [
  { id: 1, name: "Vintage Sony TV", category: "Electronics", price: 45, condition: "Excellent", emoji: "📺", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800", description: "25-inch CRT TV. Great picture quality. Perfect for retro gaming setup." },
  { id: 2, name: "PlayStation 2 + Games", category: "Electronics", price: 60, condition: "Working", emoji: "🎮", image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800", description: "Original PS2 with 2 controllers and 5 game discs. All tested and working." },
  { id: 3, name: "Large Plush Bear", category: "Toys", price: 15, condition: "Like new", emoji: "🧸", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800", description: "3-foot tall plush bear. Super soft. Like new condition." },
  { id: 4, name: "Kite Collection", category: "Toys", price: 10, condition: "New in package", emoji: "🪁", image: "https://images.unsplash.com/photo-1534710961216-75c88202f43e?w=800", description: "3 assorted kites, never opened. Great for weekend fun!" },
  { id: 5, name: "Ceramic Planters", category: "Home", price: 20, condition: "Excellent", emoji: "🪴", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800", description: "Set of 3 handcrafted ceramic planters. Various sizes." },
  { id: 6, name: "Luxury Candle Set", category: "Home", price: 12, condition: "New", emoji: "🕯️", image: "https://images.unsplash.com/photo-1602607203243-13f94085d211?w=800", description: "Premium scented candles. Vanilla, sandalwood, and lavender." },
  { id: 7, name: "Abstract Wall Art", category: "Home", price: 25, condition: "Great", emoji: "🖼️", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800", description: "24x36 framed canvas. Vibrant colors. Ready to hang." },
  { id: 8, name: "Red Stiletto Heels", category: "Fashion", price: 18, condition: "Barely worn", emoji: "👠", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800", description: "Size 8. Worn once to a wedding. Classic red stiletto." },
  { id: 9, name: "Designer Crossbody", category: "Fashion", price: 35, condition: "Good", emoji: "👜", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800", description: "Genuine leather. Adjustable strap. Multiple compartments." },
  { id: 10, name: "Vintage Leather Jacket", category: "Fashion", price: 55, condition: "Classic", emoji: "🧥", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800", description: "80s style genuine leather. Great patina. Fits medium." },
]

const categories = ["All", "Electronics", "Toys", "Home", "Fashion"]

// Admin credentials
const ADMIN_USER = 'leticia'
const ADMIN_PASS = 'Leticia2026!'

function App() {
  const [inventory, setInventory] = useState(initialInventory)
  const [filter, setFilter] = useState("All")
  const [showLogin, setShowLogin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [loginError, setLoginError] = useState('')

  const [newItem, setNewItem] = useState({ 
    name: '', 
    category: 'Electronics', 
    price: '', 
    condition: '', 
    emoji: '📦',
    description: '',
    image: ''
  })

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const filteredItems = filter === "All" 
    ? inventory 
    : inventory.filter(item => item.category === filter)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewItem({...newItem, image: reader.result})
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddItem = (e) => {
    e.preventDefault()
    const item = {
      ...newItem,
      id: Date.now(),
      price: parseFloat(newItem.price) || 0,
      image: newItem.image || `https://images.unsplash.com/photo-1557683316-973673baf926?w=800&h=400&fit=crop`
    }
    setInventory([item, ...inventory])
    setNewItem({ name: '', category: 'Electronics', price: '', condition: '', emoji: '📦', description: '', image: '' })
    setShowAddForm(false)
  }

  const handleDeleteItem = (id) => {
    setInventory(inventory.filter(item => item.id !== id))
  }

  const handleLogin = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const username = formData.get('username')
    const password = formData.get('password')
    
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setIsLoggedIn(true)
      setShowLogin(false)
      setLoginError('')
    } else {
      setLoginError('Invalid username or password')
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setShowAddForm(false)
  }

  return (
    <div className="app">
      {/* Animated Background */}
      <div className="bg-animation">
        <div className="bg-gradient"></div>
        <div className="bg-shimmer"></div>
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      {/* Header */}
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">
              <span className="logo-shimmer">💎</span>
            </div>
            <div className="logo-text">
              <h1>Leticia's Gem</h1>
              <p className="tagline">✨ Curated Finds • Local Pickup ✨</p>
            </div>
          </div>
          
          <nav className="nav-links">
            <button className="nav-btn" onClick={() => document.querySelector('.inventory-section').scrollIntoView({ behavior: 'smooth' })}>
              Shop
            </button>
            <button className="nav-btn" onClick={() => document.querySelector('.contact-section').scrollIntoView({ behavior: 'smooth' })}>
              Contact
            </button>
            {isLoggedIn ? (
              <button className="nav-btn login-btn" onClick={handleLogout}>
                🚪 Logout
              </button>
            ) : (
              <button className="nav-btn login-btn" onClick={() => setShowLogin(true)}>
                🔐 Login
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2 className="hero-title">
            <span className="hero-word">Thrift</span>
            <span className="hero-word">Flip</span>
            <span className="hero-word">Profit</span>
          </h2>
          <p className="hero-subtitle">Premium Pre-Loved Items • Handpicked Daily</p>
          <div className="hero-buttons">
            <button className="cta-btn primary" onClick={() => document.querySelector('.inventory-section').scrollIntoView({ behavior: 'smooth' })}>
              Browse Collection
            </button>
            <button className="cta-btn secondary" onClick={() => document.querySelector('.contact-section').scrollIntoView({ behavior: 'smooth' })}>
              Sell Your Items
            </button>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat-card">
            <span className="stat-number">{inventory.length}</span>
            <span className="stat-label">Items</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">100%</span>
            <span className="stat-label">Local</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">🔥</span>
            <span className="stat-label">Fresh</span>
          </div>
        </div>
      </section>

      {/* Inventory */}
      <section className="inventory-section">
        <div className="section-header">
          <h2 className="section-title">Latest Finds</h2>
          <p className="section-subtitle">New items added daily</p>
        </div>

        <nav className="category-nav">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </nav>

        <div className="items-grid">
          {filteredItems.map((item, index) => (
            <div 
              key={item.id} 
              className="item-card"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => setSelectedItem(item)}
            >
              <div className="item-image">
                <img src={item.image} alt={item.name} />
                <div className="item-badge">{item.emoji}</div>
                <div className="item-overlay">
                  <span className="view-btn">View Details</span>
                </div>
              </div>
              <div className="item-info">
                <span className="item-category">{item.category}</span>
                <h3>{item.name}</h3>
                <p className="item-condition">{item.condition}</p>
                <div className="item-footer">
                  <span className="item-price">${item.price}</span>
                  <button className="buy-btn" onClick={(e) => { e.stopPropagation(); setSelectedItem(item); }}>
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Admin Panel */}
      {isLoggedIn && (
        <section className="admin-section">
          <div className="admin-header">
            <h2>🛠️ Inventory Manager</h2>
            <button className="add-item-btn" onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? '✕ Cancel' : '+ Add New Item'}
            </button>
          </div>
          
          {showAddForm && (
            <form className="add-form" onSubmit={handleAddItem}>
              <input 
                type="text" 
                placeholder="Item name *" 
                value={newItem.name}
                onChange={e => setNewItem({...newItem, name: e.target.value})}
                required 
              />
              <select 
                value={newItem.category}
                onChange={e => setNewItem({...newItem, category: e.target.value})}
              >
                {categories.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input 
                type="number" 
                placeholder="Price *" 
                value={newItem.price}
                onChange={e => setNewItem({...newItem, price: e.target.value})}
                required 
              />
              <input 
                type="text" 
                placeholder="Condition *" 
                value={newItem.condition}
                onChange={e => setNewItem({...newItem, condition: e.target.value})}
                required 
              />
              <input 
                type="text" 
                placeholder="Emoji (📦, 👠, 🪴, etc)" 
                value={newItem.emoji}
                onChange={e => setNewItem({...newItem, emoji: e.target.value})}
              />
              <div className="image-upload-container">
                <label className="image-upload-label">
                  <span>📷 Upload Image</span>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="image-upload-input"
                  />
                </label>
                {newItem.image && <span className="image-uploaded">✓ Image loaded</span>}
              </div>
              <textarea
                className="description-input"
                placeholder="Description *"
                value={newItem.description}
                onChange={e => setNewItem({...newItem, description: e.target.value})}
                rows={3}
                required
              />
              <button type="submit" className="submit-btn">Add to Inventory</button>
            </form>
          )}
          
          <div className="inventory-count">
            Total Items: <strong>{inventory.length}</strong>
          </div>

          <div className="inventory-table">
            <h3>Current Inventory</h3>
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(item => (
                  <tr key={item.id}>
                    <td><img src={item.image} alt={item.name} className="table-thumb" /></td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>${item.price}</td>
                    <td>
                      <button className="delete-btn" onClick={() => handleDeleteItem(item.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="contact-section">
          <h2>📍 Local Pickup — Tucson, AZ Area</h2>
          <p>Text or call to schedule your pickup</p>
          <div className="marketplace-links">
            <a href="#" className="marketplace-btn">📘 Facebook</a>
            <a href="#" className="marketplace-btn">📋 Craigslist</a>
            <a href="#" className="marketplace-btn">📱 OfferUp</a>
          </div>
        </div>
        <p className="copyright">© 2026 Leticia's Gem — New items weekly! 💜</p>
      </footer>

      {/* Login Modal */}
      {showLogin && (
        <div className="modal-overlay" onClick={() => { setShowLogin(false); setLoginError(''); }}>
          <div className="login-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => { setShowLogin(false); setLoginError(''); }}>✕</button>
            <div className="modal-gem">💎</div>
            <h2>Admin Login</h2>
            <p>Enter your credentials</p>
            <form onSubmit={handleLogin}>
              <input type="text" name="username" placeholder="Username" required />
              <input type="password" name="password" placeholder="Password" required />
              {loginError && <p style={{color: '#E74C3C', marginBottom: '10px'}}>{loginError}</p>}
              <button type="submit" className="login-submit">Login</button>
            </form>
          </div>
        </div>
      )}

      {/* Item Detail Modal */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="item-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedItem(null)}>✕</button>
            <div className="item-modal-image">
              <img src={selectedItem.image} alt={selectedItem.name} />
              <div className="item-modal-badge">{selectedItem.emoji}</div>
            </div>
            <div className="item-modal-content">
              <span className="item-modal-category">{selectedItem.category}</span>
              <h2>{selectedItem.name}</h2>
              <p className="item-modal-price">${selectedItem.price}</p>
              <p className="item-modal-condition">Condition: {selectedItem.condition}</p>
              <p className="item-modal-description">{selectedItem.description}</p>
              <button className="contact-btn" onClick={() => document.querySelector('.contact-section').scrollIntoView({ behavior: 'smooth' })}>
                📱 Contact to Purchase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
