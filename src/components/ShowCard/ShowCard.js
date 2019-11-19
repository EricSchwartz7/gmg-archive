import React from 'react'
import { Card, Label } from 'semantic-ui-react'

import FormatHelper from "FormatHelper"
import './ShowCard.scss'

const ShowCard = function(props) {

    return (
        <Card color="orange" fluid className="ShowCard">
            <Card.Content>
                <Card.Header size="small">
                    <Label ribbon>{props.date}</Label>
                </Card.Header>
                <Card.Meta>
                <span>
                    {props.show.venue}
                </span>
                </Card.Meta>
                <div className="setlist-section">
                    <Card.Description>
                        <label>First Set: </label>{FormatHelper.formatSetlist(props.show.first_set)}
                    </Card.Description>
                    {props.show.second_set ?
                        <Card.Description>
                            <label>Second Set: </label>{FormatHelper.formatSetlist(props.show.second_set)}
                        </Card.Description> : null}
                    {props.show.encore ?
                        <Card.Description>
                            <label>Encore: </label>{FormatHelper.formatSetlist(props.show.encore)}
                        </Card.Description> : null}
                </div>
            </Card.Content>
        </Card>
    )
}

export default ShowCard
