import React from 'react'
import { Card, Image } from 'semantic-ui-react'

import './ShowCard.css'

const ShowCard = function(props) {

  // const routeToShow = () => {
  //   props.history.push('/shows/' + props.id)
  // }

  return (
    // href={'/shows/' + props.id}
    // onClick={routeToShow}
    <Card className="ShowCard">
      <Card.Content>
        <Card.Header size="small">
          {props.date}
        </Card.Header>
        <Card.Meta>
          <span>
            {props.venue}
          </span>
        </Card.Meta>
        <Card.Description>
          <Image className="show-image" src={props.img} size="small"/>
          Image
        </Card.Description>
      </Card.Content>


      {/* <Card.Content extra>
        <span className="rating">{props.rating} </span><span className="review-num">({props.numOfReviews})</span>
      </Card.Content> */}
    </Card>
  )

}

export default ShowCard
