import styled from 'styled-components';
import { motion } from 'framer-motion';

const FooterContainer = styled(motion.footer)`
  padding: 4rem 5%;
  background-color: var(--surface-color);
  border-top: 1px solid var(--border-color);
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const FooterColumn = styled.div``;

const ColumnTitle = styled.h4`
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
`;

const FooterLink = styled.a`
  display: block;
  margin-bottom: 1rem;
  color: var(--secondary-text-color);
  &:hover {
    color: var(--text-color);
  }
`;

const CopyrightText = styled.p`
  text-align: center;
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
  color: var(--secondary-text-color);
  font-size: 0.9rem;
`;

function Footer() {
    return (
        <FooterContainer>
            <FooterGrid>
                <FooterColumn>
                    <ColumnTitle>Zoha Architecture</ColumnTitle>
                    <p>Crafting visionary spaces that merge innovation with timeless elegance.</p>
                </FooterColumn>
                <FooterColumn>
                    <ColumnTitle>Navigate</ColumnTitle>
                    <FooterLink href="/">Home</FooterLink>
                    <FooterLink href="/projects">Projects</FooterLink>
                </FooterColumn>
                <FooterColumn>
                    <ColumnTitle>Connect</ColumnTitle>
                    <FooterLink href="https://www.instagram.com/zoha_architects/">Instagram</FooterLink>
                    <FooterLink href="mailto:zohaarchitectss@gmail.com">Gmail</FooterLink>
                    <FooterLink href="https://wa.me/0674707777">WhatsApp</FooterLink>
                </FooterColumn>
                <FooterColumn>
                    <ColumnTitle>Contact</ColumnTitle>
                    <p>Rruga Vilson,<br/>Shkoder<br/>zohaarchitectss@gmail.com</p>
                </FooterColumn>
            </FooterGrid>
            <CopyrightText>© {new Date().getFullYear()} Zoha Architecture. All Rights Reserved.</CopyrightText>
        </FooterContainer>
    );
}

export default Footer;