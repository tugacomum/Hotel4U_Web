import './perfilUser.css';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import { api } from '../../../Shared/api';
import { ScreenLoader } from '../../../components/loader/loader';


export const PerfilUser = (props) => {
    const User = props.user;

    const [Reservas, setReservas] = useState([])

    const [Quartos, setQuartos] = useState([])

    const [Hoteis, setHoteis] = useState([])

    const [loading, setLoading] = useState(true);



    useEffect(() => {
        api.get("reservas/user/" + User._id).then((res) => {
            console.log(res.data)
            setReservas(res.data)
            api.get("/hoteis").then((res) => {
                setHoteis(res.data)
                api.get("/quartos").then((res) => {
                    setQuartos(res.data)
                    setLoading(false)
                }).catch((err) => {
                    console.log(err)
                })
            }).catch((err) => {
                console.log(err)
            })
        }).catch((err) => {
            console.log(err)
        })





    }, [])

    return (
        <>{loading ? <ScreenLoader></ScreenLoader> :
            <div className="user-page">
                <div className="user-page-main">
                    <div>
                        <div id='user-page-header'>
                            <h1>Olá {User.nome} {User.apelido}</h1>
                        </div>


                        <ListGroup>
                            <ListGroup.Item>{User.email}</ListGroup.Item>
                            <ListGroup.Item>{User.telefone}</ListGroup.Item>
                            <ListGroup.Item>{User.data_nascimento}</ListGroup.Item>
                            <ListGroup.Item>{User.nif}</ListGroup.Item>
                        </ListGroup>
                    </div>
                    <div id='Tabela'>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Hotel</th>
                                    <th>Tipo de Quarto</th>
                                    <th>Check In</th>
                                    <th>Check Out</th>
                                    <th>Numero de noites</th>
                                    <th>Numero de pessoas</th>
                                    <th>Preço Total</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>


                            <tbody>

                                {Reservas.map(reserva => {

                                    const checkin = reserva.data_entrada
                                    const checkOut = reserva.data_saida

                                    const checkinSplitted = checkin.split("/")
                                    const checkOutSplitted = checkOut.split("/")

                                    const checkinDate = new Date(checkinSplitted[2], checkinSplitted[1], checkinSplitted[0])
                                    const checkOutDate = new Date(checkOutSplitted[2], checkOutSplitted[1], checkOutSplitted[0])

                                    const Hotel = Hoteis.find(hotel => hotel._id === reserva.hotel_id);
                                    const Quarto = Quartos.find(quarto => quarto._id === reserva.quarto_id);

                                    const Noites = (checkOutDate - checkinDate) / 1000 / 60 / 60 / 24;
                                    return (
                                        <tr>
                                            <td>{Hotel.nome}</td>
                                            <td>{Quarto.tipo}</td>
                                            <td>{reserva.data_entrada}</td>
                                            <td>{reserva.data_saida}</td>
                                            <td>{Noites}</td>
                                            <td>{reserva.numero_pessoas}</td>
                                            <td>{reserva.preco}</td>
                                            <td>{reserva.estado}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </div>
                </div>
            </div>}
        </>
    )
}