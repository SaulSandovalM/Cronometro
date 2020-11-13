import React, { Component } from 'react'
import './List.css'
import firebase from '../../../Firebase'
import XLSX from 'xlsx'

export default class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      lista: [
        {
          id: 1,
          name: 'preuba',
          done: false
        },
      ],
      search: '',
      listatiempos: [],
    }
    this.handleFile = this.handleFile.bind(this)
  }

  listenForItems = (itemsRef) => {
    itemsRef.on('value', (snap) => {
      var lista = [];
      snap.forEach((child) => {
        lista.push({
          agencia: child.val().agencia,
          nombre: child.val().nombre,
          inicio: child.val().inicio,
          final: child.val().final,
          tiempo: child.val().tiempo,
          done: child.val().done,
          id: child.key
        });
      });
      this.setState({
        lista: lista
      });
    });
  }

  componentDidMount() {
    const itemsRef = firebase.database().ref('marcas/')
    this.listenForItems(itemsRef)
    firebase.database().ref('marcas').on('child_added', snapshot => {
      this.setState({
        listatiempos: this.state.listatiempos.concat(snapshot.val())
      })
    })
  }

  updateSearch(event) {
    this.setState({ search: event.target.value.substr(0, 20) });
  }

  handleFile () {
    const listatiempos = [['Agencia', 'Nombre', 'Inicio', 'Final', 'Tiempo']]
    this.state.listatiempos.forEach((pres) => {
      const agencia = pres.agencia
      const nombre = pres.nombre
      const inicio = pres.inicio
      const final = pres.final
      const tiempo = pres.tiempo
      const presArray = [agencia, nombre, inicio, final, tiempo]
      listatiempos.push(presArray)
    })
    const wb = XLSX.utils.book_new()
    const wsAll = XLSX.utils.aoa_to_sheet(listatiempos)
    XLSX.utils.book_append_sheet(wb, wsAll, 'listatiempos')
    XLSX.writeFile(wb, 'Lista-Tiempos.xlsx')
  }

  render () {
    let filterData = this.state.listatiempos.filter(
      (listatiempos) => {
        return listatiempos.agencia.indexOf(this.state.search) !== -1
      }
    )

    return (
      <div style={{ margin: '30px' }}>
        <h1>Lista de Tiempos</h1>
        <button onClick={this.handleFile} style={{ background: '#092432', color: 'white' }}>
          EXPORTAR A EXCEL
        </button>
        <input style={{ marginTop: '15px', marginBottom: '15px', height: '25px' }} value={this.state.search} onChange={this.updateSearch.bind(this)} placeholder='Ingresa la agencia a buscar' />
        <div style={{ border: '1px solid grey', borderRadius: '5px', padding: '10px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'center', borderBottom: '1px solid grey' }}>
              <p style={{ width: '20%', fontWeight: 'bold' }}>Agencias</p>
              <p style={{ width: '20%', fontWeight: 'bold' }}>Nombre</p>
              <p style={{ width: '20%', fontWeight: 'bold' }}>Inicio</p>
              <p style={{ width: '20%', fontWeight: 'bold' }}>Final</p>
              <p style={{ width: '20%', fontWeight: 'bold' }}>Tiempo</p>
            </div>
          </div>
          {filterData.map(item =>
            <div style={{ display: 'flex', justifyContent: 'center', borderBottom: '1px solid grey' }}>
              <div style={{ width: '20%', height: '40px', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                {item.agencia}
              </div>
              <div style={{ width: '20%', height: '40px', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                {item.nombre}
              </div>
              <div style={{ width: '20%', height: '40px', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                {item.inicio}
              </div>
              <div style={{ width: '20%', height: '40px', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                {item.final}
              </div>
              <div style={{ width: '20%', height: '40px', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                {item.tiempo}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}
