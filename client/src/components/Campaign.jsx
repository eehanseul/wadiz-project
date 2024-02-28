import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Container, Row, Col } from "react-bootstrap";

export default function CampaignList() {
  const fetchURL = "/api/campaign";
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    axios.get(fetchURL).then((response) => {
      console.log(response.data);
      setCampaigns(response.data);
    });
  }, []);

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h1 className="mb-4 text-center text-uppercase font-weight-bold text-info">캠페인 목록</h1>
        </Col>
      </Row>
      <Row>
        {campaigns.map((campaign) => (
          <Col key={campaign._id} md={4} className="mb-4">
            <Card style={{ height: "100%" }}>
              <Card.Img
                variant="top"
                src={campaign.photoUrl}
                alt={campaign.Title}
              />
              <Card.Body>
                <Card.Title className="h5">{campaign.Title}</Card.Title>
                <Card.Subtitle className="mb-2" style={{ color: "#00A9A3" }}>
                  달성률 {campaign.achievementRate}
                </Card.Subtitle>
                <Card.Text>{campaign.coreMessage}</Card.Text>
                <Card.Subtitle
                  className="mb-2 small"
                  style={{ color: "#aaaaaa" }}
                >
                  {campaign.nickname}
                </Card.Subtitle>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
