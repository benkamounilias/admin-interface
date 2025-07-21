import corsFixedApiClient from './corsFixedApiClient';

// Service de test pour vérifier la communication après résolution CORS
export const testCommunication = async () => {
  console.log('🔄 TEST COMMUNICATION - Début des vérifications...');
  
  const results = {
    backendRunning: false,
    corsResolved: false,
    authEndpoint: false,
    usersEndpoint: false,
    emailEndpoint: false
  };

  try {
    // Test 1: Backend accessible
    console.log('1️⃣ Test : Backend accessible...');
    const healthResponse = await corsFixedApiClient.get('/actuator/health').catch(() => 
      corsFixedApiClient.get('/users').catch(() => 
        corsFixedApiClient.get('/auth/login', { validateStatus: () => true })
      )
    );
    results.backendRunning = true;
    console.log('✅ Backend accessible');

    // Test 2: CORS résolu
    console.log('2️⃣ Test : CORS résolu...');
    // Si on arrive ici sans erreur CORS, c'est bon
    results.corsResolved = true;
    console.log('✅ CORS résolu');

    // Test 3: Endpoint Auth
    console.log('3️⃣ Test : Endpoint auth...');
    const authTest = await corsFixedApiClient.post('/auth/login', {
      email: 'test@test.com',
      password: 'wrongpassword'
    }, { validateStatus: () => true });
    results.authEndpoint = authTest.status !== 500;
    console.log(results.authEndpoint ? '✅ Endpoint auth OK' : '⚠️ Endpoint auth problématique');

    // Test 4: Endpoint Users  
    console.log('4️⃣ Test : Endpoint users...');
    const usersTest = await corsFixedApiClient.get('/users', { 
      validateStatus: () => true 
    });
    results.usersEndpoint = usersTest.status !== 500;
    console.log(results.usersEndpoint ? '✅ Endpoint users OK' : '⚠️ Endpoint users problématique');

    // Test 5: Endpoint Email
    console.log('5️⃣ Test : Endpoint email...');
    const emailTest = await corsFixedApiClient.get('/api/email/test', { 
      validateStatus: () => true 
    });
    results.emailEndpoint = emailTest.status !== 500;
    console.log(results.emailEndpoint ? '✅ Endpoint email OK' : '⚠️ Endpoint email problématique');

  } catch (error: any) {
    console.error('❌ Erreur lors des tests:', error.message);
    
    if (error.message.includes('CORS') || error.message.includes('allowCredentials')) {
      console.error('🚨 CORS non résolu - Redémarrez le backend après modification de la config');
    } else if (error.code === 'ERR_NETWORK') {
      console.error('🚨 Backend non accessible - Vérifiez qu\'il est démarré sur localhost:8080');
    }
  }

  // Résumé
  console.log('\n📊 RÉSUMÉ DES TESTS:');
  console.log('Backend accessible:', results.backendRunning ? '✅' : '❌');
  console.log('CORS résolu:', results.corsResolved ? '✅' : '❌');
  console.log('Auth endpoint:', results.authEndpoint ? '✅' : '⚠️');
  console.log('Users endpoint:', results.usersEndpoint ? '✅' : '⚠️');
  console.log('Email endpoint:', results.emailEndpoint ? '✅' : '⚠️');

  return results;
};

// Auto-test au chargement de la page (optionnel)
export const autoTestOnLoad = () => {
  if (window.location.pathname === '/dashboard' || window.location.pathname === '/messages') {
    setTimeout(testCommunication, 2000);
  }
};
