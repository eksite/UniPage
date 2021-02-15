import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    margin: 0 auto;
    justify-content: center;
`;

const Header = () => {
    return (
        <Container><h2>Denis Levenets\github.com\eksite</h2></Container>
    );
};

export default Header;
