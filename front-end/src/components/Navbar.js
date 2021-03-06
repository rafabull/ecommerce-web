import React from 'react'
import $ from 'jquery'
import {Link, withRouter} from 'react-router-dom'

import './css/Navbar.css'
import { DataContext } from '../Context'
import ThemeToggler from './ThemeToggler'
import { toggleModal } from '../Util'
import SearchBar from './SearchBar'

const handleNavbarDropdown = e => {
    let dropdownMenu = $(e.target.parentElement).hasClass('drop') ? $(e.target.parentElement) : $('.drop', e.target.parentElement)

    if(e.type === 'mouseenter'){
        // Sets divisor padding
        $('.divisor'.dropdownMenu).css('padding', dropdownMenu.css('width'))

        dropdownMenu.show()

        // Menu's full height
        let previousHeight = $('ul', dropdownMenu).css('height')

        // Animates from height 0 to full height
        $('ul', dropdownMenu).css('height', '0')
        $('ul', dropdownMenu).animate({ height: previousHeight }, 150)
    }
    
    else if(e.type === 'mouseleave'){
        // Animates from full height to height 0
        $('ul', dropdownMenu).animate(
            { height: '0'}, 
            100, 
            function(){ 
                // Hides the menu
                dropdownMenu.hide() 

                // And sets it's height to automatic
                $('ul', dropdownMenu).css('height', 'auto')
            }
        )
    }
}

const toggleSearchBar = () => {
    const bar = $('.search-bar')
    
    if($(window).width() >= 960){
        const panel = $('#right-buttons')

        if(bar.css('display') === 'none'){
            bar.show()
            
            let auto = panel.css('width', 'auto').css('width')
            panel.css('width', '12%')

            panel.animate({width: auto}, 400,
                () => {
                    bar.removeClass('invisible-content')
                    $('button', bar).removeClass('no-display')
                    bar.removeClass('show-bar')
                    $('.search-bar input').focus()
                }
            )

            bar.addClass('show-bar')
        }

        else{
            $('button', bar).addClass('no-display')
            
            panel.animate({width: '12%'}, 400,
                () => {
                    bar.addClass('invisible-content')
                    $('button', bar).addClass('no-display')
                    bar.removeClass('hide-bar')
                    bar.hide()
                }
            )
            
            bar.addClass('hide-bar')
        }
    }

    else{ toggleModal('search-modal') ? $('.search-bar input').focus() : $()}
}

class Navbar extends React.Component {
    static contextType = DataContext

    constructor(props, context){
        super(props, context)

        const {categories} = this.context

        const products = categories.reduce((acc, cur) => {
            if(cur.parent === 'PR'){ acc.push(cur.name.title()) }
            return acc
        }, [])

        const events = categories.reduce((acc, cur) => {
            if(cur.parent === 'EV'){ acc.push(cur.name.title()) }
            return acc
        }, [])

        this.state = {products, events}
    }

    componentDidMount(){
        $(function(){
            $('#products-button').on('mouseenter mouseleave', handleNavbarDropdown)
            $('#events-button').on('mouseenter mouseleave', handleNavbarDropdown)
            $('#my-account').on('mouseenter mouseleave', handleNavbarDropdown)
            $('#search-button').on('click', toggleSearchBar)
        })
    }
    
    componentWillUnmount(){
        $('#products-button').off('mouseenter mouseleave', handleNavbarDropdown)
        $('#events-button').off('mouseenter mouseleave', handleNavbarDropdown)
        $('#my-account').off('mouseenter mouseleave', handleNavbarDropdown)
        $('#search-button').off('click', toggleSearchBar)
    }

    componentDidUpdate(prevProps){
        if(prevProps.location !== this.props.location && 
            ($('.search-bar').css('display') !== 'none' || $('.modal#search-modal').css('display') !== 'none')
        ){ 
            toggleSearchBar() 
        }

        else if(this.context.categories.length !== this.state.products.length + this.state.events.length){
            const {categories} = this.context

            const products = categories.reduce((acc, cur) => {
                if(cur.parent === 'PR'){ acc.push(cur.name.title()) }
                return acc
            }, [])
    
            const events = categories.reduce((acc, cur) => {
                if(cur.parent === 'EV'){ acc.push(cur.name.title()) }
                return acc
            }, [])

            this.setState({products, events})
        }
    }

    render(){
        return(
            <nav id="navbar">
                <input type="checkbox" id="check"></input>
                <label htmlFor="check" className="checkbtn">
                  <i className="fas fa-bars"></i>
                </label>
            

                <div id="logo"><Link to="/">
                    <img src={process.env.PUBLIC_URL + "/img/logo.png"} alt="Logo da SA-SHREK"/>
                </Link></div>


                <ul id="central-buttons" className="align-center">
                    <li><Link to="/">Início</Link></li>
                    <li id="products-button">
                        <Link to="/produtos">Produtos</Link>
                        {
                            this.state.products.isEmpty() ? '' :
                            <div className="drop" style={{display: 'none'}}>
                                <span className="divisor"></span>
                                <ul>
                                    { this.state.products.map((item, index) => <li key={item + index.toString()}><Link to={'/produtos/' + item.toLowerCase().replaceAll(' ', '-')}>{item}</Link></li>) }
                                </ul>
                            </div>
                        }
                    </li>

                    <li id="events-button">
                        <Link to="/eventos">Eventos</Link>
                        {
                            this.state.events.isEmpty() ? '' :
                            <div className="drop" style={{display: 'none'}}>
                                <span className="divisor"></span>
                                <ul>
                                    { this.state.events.map((item, index) => <li key={item + index.toString()}><Link to={'/eventos/' + item.toLowerCase().replaceAll(' ', '-')}>{item}</Link></li>) }
                                </ul>
                            </div>
                        }
                    </li>
                </ul>

                <ul id="right-buttons" className="align-center">
                    <li>
                        <SearchBar {...this.props} visible={false}/>
                    </li>
                    <div className='main'>
                        <li><button id="search-button" type="button" title='Pesquisar'><i className="fas fa-search"></i></button></li>
                        <li><Link to="/carrinho" title='Carrinho'><i className="fas fa-shopping-cart"></i></Link></li>
                        <li id='my-account'>
                            {
                                this.context.isLogged.status 
                                    ? <Link to='/minhaconta'>{this.context.isLogged.user.name.split(' ')[0]}</Link> 
                                    : <Link to="/login">Login</Link>
                            }
                            {
                                !this.context.isLogged.status ? '' :
                                <div className='drop' style={{display: 'none'}}>
                                    <span className='divisor'></span>
                                    <ul>
                                        <li><Link to='/minhaconta'>Minha conta</Link></li>
                                        <li><span className='disable-selection' onClick={this.context.logout}>Sair</span></li>
                                    </ul>
                                </div>
                            }
                        </li>
                        <li><ThemeToggler/></li>
                    </div>
                </ul>

                <section className="modal" id="search-modal">
                    <SearchBar {...this.props} visible={true}/>
                </section>
            </nav>
        )
    }
}

export default withRouter(Navbar)