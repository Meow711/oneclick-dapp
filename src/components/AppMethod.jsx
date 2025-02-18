import styled from 'styled-components';
import { Input, Button } from 'antd';
import { useEffect, useState } from 'react';
import { useDappContext } from '../store/contextProvider';

import { ethers } from 'ethers';

console.log(ethers);

// const StyleMethods = styled.div`
    
// `

const MButtonBox = styled.div`
    display: flex;
    justify-content: center;
`;

const MButton = styled(Button)`
    margin: 10px auto 20px;
`
const MName = styled.div`
    font-size: 1.5em;
    text-align: center;
    font-weight: bold;
    border-bottom: 1px solid #DDDDDD;
    padding-bottom: 10px;
`;

const List = styled.ul`
    margin-top: 10px;
    li {
        margin-bottom: 10px;
    }
`

export default function AppMethod({itemData, contract}) {

    const { state } = useDappContext();
    const { appData: { appName, appDesc, appAbi, appNetwork, appAddress } } = state;
    const [methodInputs, setMethodInputs] = useState([]);
    const [methodValues, setMethodValues] = useState([]);
    const [methodName, setMethodName] = useState('');
    const [callResult, setCallResult] = useState(null);

    useEffect(() => {
        if (callResult) setCallResult(undefined);
        if (!itemData) return;

        let name = itemData.split('(')[0];
        console.log(`methodName ${name}`);
        setMethodName(name);

        let method = JSON.parse(appAbi).filter(e => e.name === name)[0];
        console.log(method);

        setMethodInputs(method.inputs);
        setMethodValues(method.inputs.map(e => null));

    }, [itemData]);

    const onValueChange = async (e, index) => {
        const values = [...methodValues];
        let v = e.target.value
        const inputDef = methodInputs[index];
        if (inputDef.type.startsWith("uint")) {
            v = ethers.BigNumber.from(v);
        } 
        values[index] = v;
        setMethodValues(values);
    }

    const onSubmit = async () => {
        console.log(`onSubmit`);

        //TODO: check all values

        //Interact with wallet.
        const method = JSON.parse(appAbi).find(e => e.name === methodName)
        if (method?.type === "function") {
            if (method.stateMutability === "view") {
                let result = await contract.functions[methodName](...methodValues);
                // TODO: handle result...
                // console.log(ethers.utils.formatEther(result[0]));
                console.log(result);
                setCallResult(result[0].toString());
            }

            if (method.stateMutability === "nonpayable") {

                console.log(methodValues);
                let result = await contract.functions[methodName](...methodValues);
                console.log(result);
                let receipt = await result.wait();
                console.log(receipt);
                setCallResult("Done")
            }

            if (method.stateMutability === "payable") {
                let result = await contract.functions[methodName](...methodValues);
                await result.wait();
                setCallResult("Done")
            }
        }
    }

    return <div>
        <MName>{itemData}</MName>
        <div>
            <List>
                {methodInputs.map((item, index) => (<li key={`method_${index}`}><div>{item.name}</div><div><Input placeholder={item.type} value={methodValues[index]} onChange={(e) => onValueChange(e, index)} /></div></li>))}
            </List>
        </div>
        <MButtonBox>
            <MButton type='primary' onClick={() => onSubmit()}>SUBMIT</MButton>
        </MButtonBox>
        {!!callResult && <div>Result {callResult}</div>}
    </div>
}