import React, { Fragment } from 'react'
import { Link } from "gatsby"

const Detail = ({ pageContext: {data} }) => (
  <div>
    <div className="hero">
      <h1 className="title">Gotta Catch 'Em All</h1>
      <h2 className="subTitle">By Gatsby</h2>
      <center>
        <h2>{data.name}</h2>
        {data.sprites ? (
          <Fragment>
            <img src={data.sprites.front_default} alt="front sprite" />
            <img src={data.sprites.back_default} alt="back sprite" />
          </Fragment>
        ) : null}
      </center>
      <Link to={`/`}>Back to list</Link>
    </div>

    <style jsx>{`
      .hero {
        width: 100%;
        color: #333;
      }
      .title {
        margin: 0;
        width: 100%;
        padding-top: 80px;
        line-height: 1.15;
        font-size: 48px;
      }
      .subTitle {
        margin: 0;
        width: 100%;
        padding-top: 30px;
        line-height: 1;
        font-size: 32px;
      }
      .title,
      .subTitle
      .description {
        text-align: center;
      }
      .row {
        max-width: 880px;
        margin: 80px auto 40px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
      }
      .card {
        padding: 18px 18px 24px;
        width: 220px;
        text-align: left;
        text-decoration: none;
        color: #434343;
        border: 1px solid #9b9b9b;
      }
      .card:hover {
        border-color: #067df7;
      }
      .card h3 {
        margin: 0;
        color: #067df7;
        font-size: 18px;
      }
      .card p {
        margin: 0;
        padding: 12px 0 0;
        font-size: 13px;
        color: #333;
      }
    `}</style>
  </div>
)

export default Detail
