import React, { useState, useEffect } from 'react';
import { Text, Select, Wrap, Input, WrapItem, Stack, RadioGroup, Radio, Button, Badge } from '@chakra-ui/react'
import
{
    Divider,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from '@chakra-ui/react'
import _ from 'lodash'
import api from '../../services/api'
import moment from 'moment'
import { DeleteIcon, NotAllowedIcon } from '@chakra-ui/icons'
import Navbar from '../../components/Navbar'

const Home = () =>
{
    const [type, setType] = useState("cpf")
    const [number, setNumber] = useState()
    const [result, setResult] = useState()
    const [list, setList] = useState([])
    const [blocklist, setBlocklist] = useState([])
    const [typeList, setTypeList] = useState(true)

    const [filterByData, setFilterByData] = useState()
    const [filterByStatus, setFilterByStatus] = useState(undefined)

    const [buttonLoading, setButtonLoading] = useState(true)

    useEffect(() =>
    {
        loadAll()

        setTimeout(() =>
        {
            setResult()
        }, 30000)
    }, [result])

    const loadAll = async () =>
    {
        console.log('\tloading...')
        loadHistoric()
        loadBlocklist()
        setButtonLoading(false)
    }

    const setFilter = async () =>
    {
        setButtonLoading(true)
        //!todo enviar nos parametros os filtros para a requisição
        try {
            let res;
            if (typeList) {
                res = await api.listAll(filterByStatus, filterByData)
                setList(res.data)
            }
            else {
                res = await api.getBlocklist(filterByStatus, filterByData)
                setBlocklist(res.data)
            }
            setButtonLoading(false)
        } catch (error) {
            console.log(error)
            setButtonLoading(false)
        }

    }

    const clearFilter = async () =>
    {
        setFilterByStatus(false)
        setFilterByData(false)
        await loadAll()
    }

    const loadHistoric = async () =>
    {
        setButtonLoading(true)
        try {
            const res = await api.listAll()
            console.log(res.data)
            // console.log("aqui status->", filterByStatus)
            // if (filterByStatus !== null) res.data = _.filter(res.data, { 'isValid': filterByStatus })
            // if (filterByData !== null) res.data = _.filter(res.data, { 'createdAt': filterByData })

            setList(res.data)
            setButtonLoading(false)
        } catch (error) {
            setButtonLoading(false)
            console.log(error)
        }
    }

    const loadBlocklist = async () =>
    {
        setButtonLoading(true)
        try {
            const res = await api.getBlocklist()
            setBlocklist(res.data)
            setButtonLoading(false)
        } catch (error) {
            console.log(error)
            setButtonLoading(false)
        }
    }

    const handleValidate = async () =>
    {
        setButtonLoading(true)
        try {
            const res = await api.validate({ number, type })
            setResult(res.data)
            await handleSaveToList({
                number, type,
                isValid: res.data.includes("Verdadeiro") ? true : false
            })
            loadHistoric()
            setButtonLoading(false)
        } catch (error) {
            setButtonLoading(false)
            console.log(error)
        }
    }

    const handleRemoveFromList = async (id) =>
    {
        setButtonLoading(true)
        try {
            await api.deleteById(id)
            await loadHistoric()
            setButtonLoading(false)
        } catch (error) {
            setButtonLoading(false)
            console.log(error)
        }
    }

    const handleRemoveFromBlocklist = async (id) =>
    {
        setButtonLoading(true)
        try {
            await api.removeFromBlockList(id)
            await loadBlocklist()
            setButtonLoading(false)
        } catch (error) {
            setButtonLoading(false)
            console.log(error)
        }
    }

    const handleSaveToBlocklist = async (data) =>
    {
        setButtonLoading(true)
        try {
            await api.addToBlockList(data)
            await loadBlocklist()
            setButtonLoading(false)
        } catch (error) {
            console.log(error)
            setButtonLoading(false)
        }
    }

    const handleSaveToList = async (data) =>
    {
        setButtonLoading(true)
        try {
            await api.save(data)
            await loadHistoric()
            setButtonLoading(false)
        } catch (error) {
            console.log(error)
            setButtonLoading(false)
        }
    }


    return (
        <div>
            <Navbar />

            <Stack justify="center" align="center" p="10px" >
                <Wrap>
                    <Text fontSize="xl" color="black" fontWeight="bold">
                        Consultar
                    </Text>
                </Wrap>
                <Wrap align="center" justify="center"  >
                    <WrapItem>
                        <RadioGroup onChange={setType} value={type}>
                            <Radio defaultValue={"cpf"} p="0px 10px" value="cpf">CPF</Radio>
                            <Radio p="0px 10px" value="cnpj">CNPJ</Radio>
                        </RadioGroup>
                    </WrapItem>
                    <WrapItem>
                        <Input
                            onChange={(e) => setNumber(e.target.value)}
                            type="number"
                            variant='outline'
                            placeholder={`Digite aqui o ${type}`} />
                    </WrapItem>
                    <WrapItem>
                        <Button isLoading={buttonLoading} onClick={() => handleValidate()}>Pesquisar</Button>
                    </WrapItem>
                    {result &&
                        <WrapItem>
                            <Badge p="3" variant="solid" colorScheme={result?.includes("Verdadeiro") ? "green" : "red"}>
                                {result}
                            </Badge>
                        </WrapItem>}
                </Wrap>

                <Wrap>
                    <Button onClick={() => setTypeList(!typeList)}>{!typeList ? 'Ver histórico de consultas' : 'Ver lista de bloqueados'}</Button>
                </Wrap>

                <Divider pt="10px" w="50vw" />

                {typeList &&
                    <Wrap pt="10px">
                        <WrapItem>
                            <Text fontSize="xl" color="gray" fontWeight="normal">
                                Filtrar por:
                            </Text>
                        </WrapItem>
                        <WrapItem>
                            <Select onChange={(e) => setFilterByStatus(e.target.value)} placeholder="Status">
                                <option value={true}>Válidos</option>
                                <option value={false}>Inválidos</option>
                            </Select>
                        </WrapItem>
                        <WrapItem>
                            <Input onChange={(e) => { setFilterByData(e.target.value) }} type='date' variant="outline" placeholder="Data de consulta"></Input>
                        </WrapItem>
                        {(filterByData != null || filterByStatus != null) &&
                            <>
                                <WrapItem> <Button isLoading={buttonLoading} colorScheme="teal" onClick={() => setFilter()}>Aplicar filtros</Button></WrapItem>
                                <WrapItem> <Button isLoading={buttonLoading} colorScheme="red" onClick={() => clearFilter()}>Limpar filtros</Button></WrapItem>
                            </>
                        }
                    </Wrap>}

                <Wrap pt="10px">
                    <WrapItem>
                        <TableContainer>
                            <Table variant='striped' colorScheme='pink'>
                                {/* <TableCaption>Histórico de consultas</TableCaption> */}
                                <TableCaption>
                                    {typeList ? 'Histórico de consultas' : 'Lista de bloqueados'}</TableCaption>
                                <Thead>
                                    <Tr>
                                        <Th>Data</Th>
                                        <Th>Cpf/Cnpj</Th>
                                        <Th>Status</Th>
                                        <Th>Ações</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {/* {_.map(list, elem => */}
                                    {_.map(typeList ? list : blocklist, elem =>
                                    {
                                        return (
                                            <Tr>
                                                <Td>{moment(elem.createdAt).format("LLL")}</Td>
                                                <Td isNumeric>{elem.number}</Td>
                                                <Td isNumeric>{elem.isValid ? "Válido" : "Inválido"}</Td>
                                                <Td isNumeric>
                                                    {typeList ? <Button isLoading={buttonLoading} onClick={() => handleSaveToBlocklist(elem)} m="0px 1px"><NotAllowedIcon /></Button>
                                                        : ''}
                                                    {typeList ?
                                                        <Button isLoading={buttonLoading} onClick={() => { handleRemoveFromList(elem._id) }} m="0px 1px"><DeleteIcon /></Button>
                                                        :
                                                        <Button isLoading={buttonLoading} onClick={() => { handleRemoveFromBlocklist(elem._id) }} m="0px 1px"><DeleteIcon /></Button>
                                                    }
                                                </Td>
                                            </Tr>)
                                    })}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </WrapItem>
                </Wrap>
            </Stack>
        </div >
    )
}

export default Home;