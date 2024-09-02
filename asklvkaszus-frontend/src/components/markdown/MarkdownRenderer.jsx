import React from 'react';
import ReactMarkdown from "react-markdown";
import YouTube from "react-youtube";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const MarkdownRenderer = ({ content }) => {
    const allowedElements = ["p", "strong", "em", "a"];

    function extractVideoId(url) {
        const regex =
            /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([^&?/]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    const customRenderer = {
        p: ({ children }) => <>{children}</>,
        strong: ({ children }) => <strong>{children}</strong>,
        em: ({ children }) => <em>{children}</em>,
        a: ({ href, children }) => {
            const youtubeRegex =
                /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)/;
            const mapRegex =
                /^%5B[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)%5D$/;

            if (href.match(youtubeRegex)) {
                const videoId = extractVideoId(href);
                return (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <YouTube
                            videoId={videoId}
                            opts={{
                                width: "100%",
                                height: "200px",
                                playerVars: { autoplay: 0 },
                            }}
                        />
                    </Box>
                );
            }

            if (href.match(mapRegex)) {
                const match = href.match(mapRegex);
                const lat = parseFloat(match[1]);
                const lng = parseFloat(match[4]);
                return (
                    <Box sx={{ width: '100%', height: '200px' }}>
                        <MapContainer
                            css={css({ width: '100%', height: '100%' })}
                            center={[lat, lng]}
                            zoom={13}
                            scrollWheelZoom={false}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[lat, lng]}>
                                <Popup>{children}</Popup>
                            </Marker>
                        </MapContainer>
                    </Box>
                );
            }

            return (
                <Link css={css({ textDecoration: 'underline' })} to={href} target="_blank" rel="noreferrer noopener">
                    {children}
                </Link>
            );
        },
    };


  return (
      <ReactMarkdown allowedElements={allowedElements} components={customRenderer}>
        {content}
      </ReactMarkdown>
  );
};

export default MarkdownRenderer;
