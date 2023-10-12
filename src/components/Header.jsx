import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import logo from '../res/oneclick.png';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const HeaderTop = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100vw;
    padding: 20px 5%;
    box-sizing: border-box;
`;

const Logo = styled.div`
    padding-top: 0.1rem;
    img {
        width: 80px;
    }
`;

export default function Header() {
    const navigate = useNavigate();

    const backToHome = async () => {
        navigate('/home');
    };

    return (
        <HeaderTop>
            <Logo>
                <img
                    src={logo}
                    alt=""
                    onClick={() => {
                        backToHome();
                    }}
                />
            </Logo>
            <ConnectButton showBalance accountStatus="address" />
        </HeaderTop>
    );
}
