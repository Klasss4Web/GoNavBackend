import React from 'react';
import { Page, Button, Icon, Navbar } from 'framework7-react';
import "../css/routePage.css"
import '../css/app.css'
import { motion } from 'framer-motion';
import TransportCard from '../components/reusableCard.jsx';
import NotificationDot from "../components/component.jsx";
import { routeFetch } from "../js/mapComponent";

export let selectedRouteCode = "";

const RoutePage = () => {
  const totalRoute = routeFetch(); // Call the hook


  return (
    <Page >
      <div className='route-content'>
        <div className='route-overlay'>

          <div className='route-header'>
            <motion.div
              initial={{ opacity: 0, y: 70 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <div style={{ width: '100%', marginTop: '3%', }} className='align-horizontally'>

                <Button
                  size="default"
                  shape="round"
                  style={{ color: "white" }}
                  href="/"
                  routerDirection="back"
                >
                  <Icon ios="f7:arrow_left" md="f7:arrow_left" />

                </Button>
                <h1 style={{
                  // position: 'absolute',
                  // left: '50%',
                  transform: 'translateX(-10%)',
                  // marginTop: 0,
                  flex: 1,
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}>
                  Bus Routes
                </h1>

              </div>

              <div
                style={{
                  // marginTop: "2%",
                  // transform: 'translateY(0%)',
                  background: 'rgba(255 255 255 / 0.15)',
                  borderRadius: 20,
                  maxWidth: '60%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  padding: '8px 12px',
                  fontWeight: '400',
                  fontSize: '18px',
                }}
                className='align-horizontally'
              >
                <Icon material='alt_route'></Icon>
                Available Routes  <b style={{marginLeft:"5%"}}>{totalRoute.length}</b>
                {/* <NotificationDot color="var(--success-emerald)" /> */}
              </div>


              <div >
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <div style={{ padding: '16px' }}>

              {totalRoute.map((route, index) => (
                <TransportCard
                 key={index}
                  routeCode={route.routeCode}
                  routeName={route.route}
                  stops={route.stops-1}
                  destination={route.destination}
                  trackerId= {route.trackerId}
                  routeColor="#ef4444"
                  iconImageUrl="../assets/img/mark.png"
                  onCardClick={(code) => {
                    console.log("Clicked route:", code);
                  }}
                />
              ))}
              {/* <TransportCard
                routeCode="IPJ221"
                routeName="Ipaja - Interswitch"
                stops="12"
                status={false}
                routeColor="#ef4444"
                iconImageUrl="../assets/img/mark.png"
                onCardClick={(code) => {
                  console.log("Clicked route:", code);
                }}

              /> */}

              {/* <TransportCard
              routeName="Iyana-Ipaja"
              routeCode="LME-001"
              destination="Marina Terminal"
              distance="24.5"
              duration="45 min"
              iconBgColor="#ef4444"
              iconImageUrl="../assets/img/marker.png"
            /> */}
            </div>
          </motion.div>



        </div>
      </div>
    </Page>
  );
};

export default RoutePage;
