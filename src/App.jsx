import { useState, useEffect } from 'react'
import './App.css'

const categories = ["All", "Electronics", "Toys", "Home", "Fashion"]

// Admin credentials
const ADMIN_USER = 'latisha'
const ADMIN_PASS = 'Latisha2026!'

// Load inventory - from cloud (Gist)
const loadInventory = async () => {
  try {
    const res = await fetch('/api/sheets')
    const data = await res.json()
    if (Array.isArray(data) && data.length > 0) return data
  } catch {}
  // Fallback to localStorage
  const saved = localStorage.getItem('latisha_inventory')
  if (saved) return JSON.parse(saved)
  return []
}

// Save - to cloud (instant for customers)
const saveInventory = async (inventory) => {
  localStorage.setItem('latisha_inventory', JSON.stringify(inventory))
  try {
    const res = await fetch('/api/sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inventory })
    })
    if (res.ok) {
      alert('Saved to cloud!')
      return true
    }
  } catch {}
  alert('Saved locally')
  return true
}

function App() {
  const [inventory, setInventory] = useState([])
  const [filter, setFilter] = useState("All")
  const [showLogin, setShowLogin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadInventory().then(data => { setInventory(data); setLoading(false) })
  }, [])

  const [newItem, setNewItem] = useState({ 
    name: '', category: 'Electronics', price: '', condition: '', emoji: '📦', description: '', image: ''
  })

  useEffect(() => {
    window.addEventListener('scroll', () => setScrolled(window.scrollY > 50))
    return () => window.removeEventListener('scroll', () => {})
  }, [])

  const filteredItems = filter === "All" ? inventory : inventory.filter(i => i.category === filter)
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert('Image too large'); return }
    setUploading(true)
    const formData = new FormData()
    formData.append('image', file)
    try {
      const res = await fetch('https://api.imgbb.com/1/upload?key=d36eb6591370ae7f9089d85875571358', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) setNewItem({...newItem, image: data.data.url})
    } catch {}
    setUploading(false)
  }

  const handleAddItem = async (e) => {
    e.preventDefault()
    setSaving(true)
    const item = { ...newItem, id: Date.now(), price: parseFloat(newItem.price) || 0, image: newItem.image || 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800' }
    const updated = [item, ...inventory]
    setInventory(updated)
    await saveInventory(updated)
    setSaving(false)
    setNewItem({ name: '', category: 'Electronics', price: '', condition: '', emoji: '📦', description: '', image: '' })
    setShowAddForm(false)
  }

  const handleEditItem = (item) => { setNewItem({ ...item }); setShowAddForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  const handleUpdateItem = async (e) => {
    e.preventDefault()
    setSaving(true)
    const updated = inventory.map(i => i.id === newItem.id ? { ...newItem, price: parseFloat(newItem.price) || 0 } : i)
    setInventory(updated)
    await saveInventory(updated)
    setSaving(false)
    setNewItem({ name: '', category: 'Electronics', price: '', condition: '', emoji: '📦', description: '', image: '' })
    setShowAddForm(false)
  }

  const handleDeleteItem = async (id) => {
    if (confirm('Delete?')) {
      setSaving(true)
      const updated = inventory.filter(i => i.id !== id)
      setInventory(updated)
      await saveInventory(updated)
      setSaving(false)
    }
  }

  const handleLogin = (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    if (fd.get('username') === ADMIN_USER && fd.get('password') === ADMIN_PASS) {
      setIsLoggedIn(true); setShowLogin(false); setLoginError('')
    } else setLoginError('Invalid')
  }

  return (
    <div className="app">
      <div className="bg-animation">
        <div className="bg-gradient"></div><div className="bg-shimmer"></div>
        <div className="floating-shapes"><div className="shape shape-1"></div><div className="shape shape-2"></div><div className="shape shape-3"></div></div>
      </div>

      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon"><span className="logo-shimmer">💎</span></div>
            <div className="logo-text"><h1>Latisha's Gem</h1><p className="tagline">✨ Curated Finds • Local Pickup ✨</p></div>
          </div>
          <nav className="nav-links">
            <button className="nav-btn" onClick={() => document.querySelector('.inventory-section')?.scrollIntoView({behavior:'smooth'})}>Shop</button>
            <button className="nav-btn" onClick={() => document.querySelector('.contact-section')?.scrollIntoView({behavior:'smooth'})}>Contact</button>
            {isLoggedIn ? <button className="nav-btn login-btn" onClick={() => {setIsLoggedIn(false); setShowAddForm(false)}}>🚪 Logout</button> 
              : <button className="nav-btn login-btn" onClick={() => setShowLogin(true)}>🔐 Login</button>}
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h2 className="hero-title"><span className="hero-word">Thrift</span><span className="hero-word">Flip</span><span className="hero-word">Profit</span></h2>
          <p className="hero-subtitle">Premium Pre-Loved Items • Handpicked Daily</p>
          <div className="hero-buttons">
            <button className="cta-btn primary" onClick={() => document.querySelector('.inventory-section')?.scrollIntoView({behavior:'smooth'})}>Browse</button>
            <button className="cta-btn secondary" onClick={() => document.querySelector('.contact-section')?.scrollIntoView({behavior:'smooth'})}>Sell</button>
          </div>
        </div>
        <div className="hero-stats">
          <div className="stat-card"><span className="stat-number">{loading ? '...' : inventory.length}</span><span className="stat-label">Items</span></div>
          <div className="stat-card"><span className="stat-number">100%</span><span className="stat-label">Local</span></div>
          <div className="stat-card"><span className="stat-number">🔥</span><span className="stat-label">Fresh</span></div>
        </div>
      </section>

      <section className="inventory-section">
        <div className="section-header"><h2 className="section-title">Latest Finds</h2><p className="section-subtitle">New items added daily</p></div>
        <nav className="category-nav">{categories.map(cat => <button key={cat} className={`filter-btn ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>{cat}</button>)}</nav>
        <div className="items-grid">
          {filteredItems.map((item, i) => (
            <div key={item.id} className="item-card" style={{animationDelay:`${i*0.05}s`}} onClick={() => setSelectedItem(item)}>
              <div className="item-image"><img src={item.image} alt={item.name} /><div className="item-badge">{item.emoji}</div><div className="item-overlay"><span>View</span></div></div>
              <div className="item-info"><span className="item-category">{item.category}</span><h3>{item.name}</h3><p className="item-condition">{item.condition}</p>
                <div className="item-footer"><span className="item-price">${item.price}</span><button className="buy-btn" onClick={e => {e.stopPropagation(); setSelectedItem(item)}}>Details</button></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {isLoggedIn && (
        <section className="admin-section">
          <div className="admin-header"><h2>🛠️ Inventory Manager</h2><button className="add-item-btn" onClick={() => {setShowAddForm(!showAddForm); setNewItem({name:'',category:'Electronics',price:'',condition:'',emoji:'📦',description:'',image:''})}}>{showAddForm?'✕ Cancel':'+ Add New'}</button></div>
          {showAddForm && (
            <form className="add-form" onSubmit={newItem.id ? handleUpdateItem : handleAddItem}>
              <input type="text" placeholder="Item name *" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} required />
              <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})}>{categories.filter(c => c!=='All').map(c => <option key={c} value={c}>{c}</option>)}</select>
              <input type="number" placeholder="Price *" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} required />
              <input type="text" placeholder="Condition *" value={newItem.condition} onChange={e => setNewItem({...newItem, condition: e.target.value})} required />
              <input type="text" placeholder="Emoji" value={newItem.emoji} onChange={e => setNewItem({...newItem, emoji: e.target.value})} />
              <div className="image-upload-container">
                <label className="image-upload-label"><span>{uploading?'⏳':'📷 Upload'}</span><input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} /></label>
                {newItem.image && <><span className="image-uploaded">✓</span><button type="button" onClick={() => setNewItem({...newItem,image:''})} style={{background:'#E74C3C',border:'none',color:'white',padding:'8px',borderRadius:'8px',cursor:'pointer'}}>✕</button></>}
              </div>
              <input type="url" placeholder="Or paste image URL..." value={newItem.image||''} onChange={e => setNewItem({...newItem, image: e.target.value})} style={{gridColumn:'1/-1'}} />
              <textarea placeholder="Description *" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} rows={3} required />
              <button type="submit" className="submit-btn" disabled={saving}>{saving?'⏳':(newItem.id?'✓ Update':'+ Add to Inventory')}</button>
              {newItem.id && <button type="button" className="submit-btn" style={{background:'#E74C3C'}} onClick={() => {setNewItem({name:'',category:'Electronics',price:'',condition:'',emoji:'📦',description:'',image:''}); setShowAddForm(false)}}>Cancel</button>}
            </form>
          )}
          <div className="inventory-count">Total: <strong>{inventory.length}</strong></div>
          <div className="inventory-table">
            <table><thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Actions</th></tr></thead>
              <tbody>{inventory.map(item => <tr key={item.id}><td><img src={item.image} alt={item.name} className="table-thumb" /></td><td>{item.name}</td><td>{item.category}</td><td>${item.price}</td><td><button onClick={() => handleEditItem(item)} style={{background:'#3498DB',border:'none',color:'white',padding:'8px',borderRadius:'8px',cursor:'pointer',marginRight:'8px'}}>✏️</button><button onClick={() => handleDeleteItem(item.id)} disabled={saving}>🗑️</button></td></tr>)}</tbody>
            </table>
          </div>
        </section>
      )}

      <footer className="footer">
        <div className="contact-section">
          <h2>📍 Tucson, AZ</h2>
          <p>Click below to contact Latisha</p>
          <a href="mailto:latishamyisha@yahoo.com?subject=Interested in your curated finds" className="contact-email-btn">
            📧 Contact Latisha
          </a>
        </div>
        <p className="copyright">© 2026 Latisha's Gem 💜</p>
      </footer>

      {showLogin && <div className="modal-overlay" onClick={() => {setShowLogin(false);setLoginError('')}}><div className="login-modal" onClick={e => e.stopPropagation()}>
        <button className="close-modal" onClick={() => {setShowLogin(false);setLoginError('')}}>✕</button>
        <div className="modal-gem">💎</div><h2>Admin Login</h2><form onSubmit={handleLogin}>
          <input type="text" name="username" placeholder="Username" required /><input type="password" name="password" placeholder="Password" required />
          {loginError && <p style={{color:'#E74C3C'}}>{loginError}</p>}<button type="submit" className="login-submit">Login</button>
        </form></div></div>}

      {selectedItem && <div className="modal-overlay" onClick={() => setSelectedItem(null)}><div className="item-modal" onClick={e => e.stopPropagation()}>
        <button className="close-modal" onClick={() => setSelectedItem(null)}>✕</button>
        <div className="item-modal-image"><img src={selectedItem.image} alt={selectedItem.name} /><div className="item-modal-badge">{selectedItem.emoji}</div></div>
        <div className="item-modal-content"><span className="item-modal-category">{selectedItem.category}</span><h2>{selectedItem.name}</h2><p className="item-modal-price">${selectedItem.price}</p><p className="item-modal-condition">Condition: {selectedItem.condition}</p><p className="item-modal-description">{selectedItem.description}</p>
          <button className="contact-btn" onClick={() => window.location.href = 'mailto:latishamyisha@yahoo.com?subject=Interested in ' + encodeURIComponent(selectedItem.name)}>📧 Contact Latisha</button></div>
      </div></div>}
    </div>
  )
}

export default App
