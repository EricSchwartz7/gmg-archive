import React from 'react'
import { Card, Label } from 'semantic-ui-react'

import FormatHelper from "FormatHelper"
import './ShowCard.scss'

const ShowCard = function(props) {

    const firstSet = FormatHelper.formatSetlist(props.show.setlist, 1);
    const secondSet = FormatHelper.formatSetlist(props.show.setlist, 2);
    const encore = FormatHelper.formatSetlist(props.show.setlist, 3);

    return (
        <Card color="orange" fluid className="ShowCard">
            <Card.Content>
                <Card.Header size="small">
                    <Label ribbon>{props.date}</Label>
                </Card.Header>
                <Card.Meta>
                <span>{props.show.venue}</span>
                </Card.Meta>
                <div className="setlist-section">
                    <Card.Description>
                        <div><label>First Set: </label>{firstSet}</div>
                    </Card.Description>
                    <Card.Description>
                        {secondSet.length > 0 ?
                            <div><label>Second Set: </label>{secondSet}</div> : null
                        }
                    </Card.Description>
                    <Card.Description>
                        {encore.length > 0 ?
                            <div><label>Encore: </label>{encore}</div> : null
                        }
                    </Card.Description>
                </div>
            </Card.Content>
        </Card>
    )
}

export default ShowCard
