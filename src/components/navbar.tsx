import React from 'react';
import './navbar.css';

const Navbar = () => {
  return (
    <div className="wrapper">
      <div className="div__search">
        <input type="text" placeholder="Tìm kiếm..." id="search-input" />
        <div className="search"></div>
      </div>
      <ul id="suggestions-list"></ul>

      <div className="left-panel">
        <div className="radio-buttons">
          <label className="radio-label">
            <input
              type="radio"
              name="click"
              value="atraction"
              //onChange={(e) => changeImage(e.target)}
              id="atraction"
            />
            <span>
              <img
                id="image1"
                src="https://platinumaps.blob.core.windows.net/maps/267/category/7625_highlight.png?v=638064414426586250"
                alt="..."
              />
              <p>Atractions</p>
            </span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="click"
              value="restaurant"
              //onChange={(e) => changeImage(e.target)}
              id="restaurant"
            />
            <span>
              <img
                id="image2"
                src="https://platinumaps.blob.core.windows.net/static/icon/category/restaurant.png?v=638064414342265251"
                alt="..."
              />
              <p>Restaurant</p>
            </span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="click"
              value="shopping"
              //onChange={(e) => changeImage(e.target)}
              id="shopping"
            />
            <span>
              <img
                id="image3"
                src="https://platinumaps.blob.core.windows.net/static/icon/category/shopping.png?v=638064414254106175"
                alt=""
              />
              <p>Shopping</p>
            </span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="click"
              value="all"
              //onChange={(e) => changeImage(e.target)}
              id="all"
            />
            <span>
              <img
                id="image4"
                src="https://platinumaps.blob.core.windows.net/maps/267/category/7801.png?v=637808459331964325"
                alt=""
              />
              <p>All</p>
            </span>
          </label>
        </div>
      </div>

      <div id="input-tim">
        <div>
          <select className="form-control form-control" id="start-street">
            <option value="" disabled>
              Chọn điểm bắt đầu
            </option>
          </select>
        </div>
        <div>
          <select
            className="form-control input-solid"
            id="end-street"
          >
            <option value="" disabled>
              Chọn điểm cần đến
            </option>
          </select>
        </div>
        <button className="btn btn-primary" id="search-street">
          Tìm đường
        </button>
        <button className='btn btn-primary' id='search-address'>Tìm điểm</button>
      </div>

      <div id="map" style={{ width: '100%', height: '100vh' }} />

      <div className="right-panel">
        <div className="card">
          <div className="close">
            <i className="fa-solid fa-xmark" ></i>
            <i id="closeRight">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-lg" viewBox="0 0 16 16">
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
              </svg>
            </i>
          </div>
          <img
            src=""
            className="card-img-top"
            alt="..."
            height="300px"
            id="img-address"
          />
          <div className="card-body">
            <h5 className="card-title" id="listul"></h5>
            <div className="accordion" id="accordionex"></div>
            <div className="call">
              <hr />
              <i className="fas fa-map-marker-alt"></i> VinWonders Nha Trang{" "}
              <br />
              <i className="fas fa-link"></i>{" "}
              https://kenta.azdigi.blog/digimap-vinwonder/ <br />
              <i className="fas fa-phone-alt"></i> 0123456789
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar