import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

interface POSItem {
    id: number;
    type: 'service' | 'product';
    name: string;
    price: number;
    category: string;
    duration?: string;
}

interface CartItem extends POSItem {
    qty: number;
    lineTotal: number;
    lineDiscount: number;
    taxRate: number;
}

interface Customer {
    id: number;
    name: string;
    phone?: string;
    email?: string;
    notes?: string;
}

interface Payment {
    method: string;
    amount: number;
    reference?: string;
}

interface POSProps {
    onBack?: () => void;
}

const POS: React.FC<POSProps> = ({ onBack }) => {
    const [items, setItems] = useState<POSItem[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [customerSearch, setCustomerSearch] = useState('');
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [currentSale, setCurrentSale] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [barber, setBarber] = useState('');
    const [notes, setNotes] = useState('');
    const [activeStep, setActiveStep] = useState(1); // 1: Prepare Cart, 2: Hardware, 3: Payment, 4: Receipt
    const [activeTab, setActiveTab] = useState('pos'); // Welcome, Consult, Customer, Enroll, POS, Repair, More
    const [salesHistory, setSalesHistory] = useState<any[]>([]);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
    const [currentLanguage, setCurrentLanguage] = useState('EN'); // EN, ES, FR, PK, etc.
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [currentCurrency, setCurrentCurrency] = useState('EUR'); // EUR, USD, GBP, PKR, etc.

    // Payment modal state
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [paidAmount, setPaidAmount] = useState(0);
    const [paymentReference, setPaymentReference] = useState('');

    // New customer modal state
    const [newCustomer, setNewCustomer] = useState({
        name: '',
        phone: '',
        email: '',
        notes: ''
    });

    // Language translations
    const translations = {
        EN: {
            welcome: 'Welcome',
            consult: 'Consult',
            customer: 'Customer',
            enroll: 'Enroll',
            pos: 'POS',
            repair: 'Repair',
            more: 'More',
            saloonPos: 'Saloon POS',
            cart: 'CART',
            selectArticles: 'Select Articles',
            billPayment: 'Bill payment',
            loadCart: 'Load cart',
            returnExchange: 'Return / Exchange',
            saveCart: 'Save cart',
            discount: 'Discount',
            createOffer: 'Create offer',
            prepaidItems: 'Prepaid items',
            clearableServices: 'Clearable services',
            showArticlesOnStock: 'Show articles on stock only',
            advancedArticleSearch: 'Advanced article search',
            prepareCart: 'Prepare Cart',
            hardwareStation: 'Hardware station',
            payment: 'Payment',
            receipt: 'Receipt',
            salesPaymentHistory: 'Sales & Payment History',
            receiptsInvoices: 'Receipts & Invoices',
            viewReceipt: 'View Receipt',
            print: 'Print',
            noReceiptsAvailable: 'No receipts available',
            completeSaleToGenerate: 'Complete a sale to generate receipts',
            connectedDevices: 'Connected Devices',
            systemStatus: 'System Status',
            barcodeScanner: 'Barcode Scanner',
            receiptPrinter: 'Receipt Printer',
            cashDrawer: 'Cash Drawer',
            network: 'Network',
            database: 'Database',
            backup: 'Backup',
            connected: 'Connected',
            online: 'Online',
            active: 'Active',
            invoice: 'Invoice #',
            customerName: 'Customer',
            items: 'Items',
            total: 'Total',
            paymentMethod: 'Payment Method',
            status: 'Status',
            date: 'Date',
            noSalesHistory: 'No sales history available',
            consultButton: 'CONSULT',
            goToCheckout: 'GO TO CHECKOUT',
            wasAddedToCart: 'was added to your CART',
            selectCustomer: 'Select Customer',
            searchCustomers: 'Search customers...',
            walkInCustomer: 'Walk-in Customer',
            addNewCustomer: 'Add New Customer',
            name: 'Name',
            phone: 'Phone (optional)',
            email: 'Email (optional)',
            createCustomer: 'Create Customer',
            creating: 'Creating...',
            cancel: 'Cancel',
            paymentLabel: 'Payment',
            amountPaid: 'Amount Paid',
            reference: 'Reference (optional)',
            balance: 'Balance',
            processing: 'Processing...',
            completeSale: 'Complete Sale',
            saleComplete: 'Sale Complete!',
            totalAmount: 'Total Amount',
            done: 'Done',
            receiptDetails: 'Receipt Details',
            printReceipt: 'Print Receipt',
            close: 'Close',
            thankYouForBusiness: 'Thank you for your business!',
            generatedOn: 'Generated on',
            barbershop: 'BARBERSHOP',
            subtotal: 'Subtotal',
            includedTax: 'Included tax (20%)',
            qty: 'Qty',
            position: 'Position',
            totalEur: 'Total (EUR)',
            articleId: 'Article ID',
            searchOrScanArticle: 'Search or scan article',
            noItemsInCart: 'No items in cart',
            noSearchResults: 'No search results',
            pleaseAddItemsToCart: 'Please add items to cart before proceeding to payment',
            cartLoadedSuccessfully: 'Cart loaded successfully!',
            errorLoadingSavedCart: 'Error loading saved cart',
            noSavedCartFound: 'No saved cart found',
            noSalesHistoryForReturns: 'No sales history available for returns/exchanges',
            returnExchangeFunctionality: 'Return/Exchange functionality - This would open a returns management interface',
            cartSavedSuccessfully: 'Cart saved successfully! You can load it later.',
            noItemsInCartToSave: 'No items in cart to save',
            pleaseAddItemsToCartBeforeDiscount: 'Please add items to cart before applying discount',
            enterDiscountPercentage: 'Enter discount percentage (0-100):',
            discountApplied: 'Discount of {discount}% applied to all items',
            discountMustBeBetween: 'Discount must be between 0 and 100',
            enterOfferName: 'Enter offer name:',
            enterOfferDiscount: 'Enter offer discount percentage:',
            offerCreated: 'Offer "{name}" created with {discount}% discount',
            selectPrepaidType: 'Select prepaid type:\n1. Gift Card\n2. Service Package\n3. Membership',
            enterAmount: 'Enter amount:',
            prepaidCreated: 'Prepaid {type} created for €{amount}',
            areYouSureClearCart: 'Are you sure you want to clear all items from the cart?',
            cartClearedSuccessfully: 'Cart cleared successfully',
            cartIsAlreadyEmpty: 'Cart is already empty',
            stockFilterToggled: 'Stock filter toggled - This would filter items based on stock availability',
            selectSearchType: 'Select search type:\n1. By Name\n2. By Category\n3. By Price Range\n4. By Barcode',
            enterSearchValue: 'Enter search value:',
            advancedSearch: 'Advanced search: {type} = {value}',
            welcomeTab: 'Welcome tab - This would navigate to the welcome/dashboard page',
            consultTab: 'Consult tab - This would open consultation management',
            customerTab: 'Customer tab - This would open customer management',
            enrollTab: 'Enroll tab - This would open customer enrollment',
            repairTab: 'Repair tab - This would open repair/service management',
            moreTab: 'More tab - This would show additional options',
            languageSettings: 'Language Settings',
            selectLanguage: 'Select Language',
            applyLanguage: 'Apply Language',
            languageChanged: 'Language changed successfully!'
        },
        ES: {
            welcome: 'Bienvenido',
            consult: 'Consultar',
            customer: 'Cliente',
            enroll: 'Inscribir',
            pos: 'POS',
            repair: 'Reparar',
            more: 'Más',
            saloonPos: 'Salón POS',
            cart: 'CARRITO',
            selectArticles: 'Seleccionar Artículos',
            billPayment: 'Pago de factura',
            loadCart: 'Cargar carrito',
            returnExchange: 'Devolución / Cambio',
            saveCart: 'Guardar carrito',
            discount: 'Descuento',
            createOffer: 'Crear oferta',
            prepaidItems: 'Artículos prepagados',
            clearableServices: 'Servicios cancelables',
            showArticlesOnStock: 'Mostrar solo artículos en stock',
            advancedArticleSearch: 'Búsqueda avanzada de artículos',
            prepareCart: 'Preparar Carrito',
            hardwareStation: 'Estación de hardware',
            payment: 'Pago',
            receipt: 'Recibo',
            salesPaymentHistory: 'Historial de Ventas y Pagos',
            receiptsInvoices: 'Recibos y Facturas',
            viewReceipt: 'Ver Recibo',
            print: 'Imprimir',
            noReceiptsAvailable: 'No hay recibos disponibles',
            completeSaleToGenerate: 'Complete una venta para generar recibos',
            connectedDevices: 'Dispositivos Conectados',
            systemStatus: 'Estado del Sistema',
            barcodeScanner: 'Escáner de Código de Barras',
            receiptPrinter: 'Impresora de Recibos',
            cashDrawer: 'Cajón de Efectivo',
            network: 'Red',
            database: 'Base de Datos',
            backup: 'Respaldo',
            connected: 'Conectado',
            online: 'En Línea',
            active: 'Activo',
            invoice: 'Factura #',
            customerName: 'Cliente',
            items: 'Artículos',
            total: 'Total',
            paymentMethod: 'Método de Pago',
            status: 'Estado',
            date: 'Fecha',
            noSalesHistory: 'No hay historial de ventas disponible',
            consultButton: 'CONSULTAR',
            goToCheckout: 'IR A PAGAR',
            wasAddedToCart: 'fue agregado a tu CARRITO',
            selectCustomer: 'Seleccionar Cliente',
            searchCustomers: 'Buscar clientes...',
            walkInCustomer: 'Cliente Ocasional',
            addNewCustomer: 'Agregar Nuevo Cliente',
            name: 'Nombre',
            phone: 'Teléfono (opcional)',
            email: 'Correo (opcional)',
            createCustomer: 'Crear Cliente',
            creating: 'Creando...',
            cancel: 'Cancelar',
            paymentLabel: 'Pago',
            amountPaid: 'Cantidad Pagada',
            reference: 'Referencia (opcional)',
            balance: 'Saldo',
            processing: 'Procesando...',
            completeSale: 'Completar Venta',
            saleComplete: '¡Venta Completada!',
            totalAmount: 'Cantidad Total',
            done: 'Hecho',
            receiptDetails: 'Detalles del Recibo',
            printReceipt: 'Imprimir Recibo',
            close: 'Cerrar',
            thankYouForBusiness: '¡Gracias por su negocio!',
            generatedOn: 'Generado el',
            barbershop: 'BARBERÍA',
            subtotal: 'Subtotal',
            includedTax: 'Impuesto incluido (20%)',
            qty: 'Cant',
            position: 'Posición',
            totalEur: 'Total (EUR)',
            articleId: 'ID del Artículo',
            searchOrScanArticle: 'Buscar o escanear artículo',
            noItemsInCart: 'No hay artículos en el carrito',
            noSearchResults: 'No hay resultados de búsqueda',
            pleaseAddItemsToCart: 'Por favor agregue artículos al carrito antes de proceder al pago',
            cartLoadedSuccessfully: '¡Carrito cargado exitosamente!',
            errorLoadingSavedCart: 'Error al cargar el carrito guardado',
            noSavedCartFound: 'No se encontró carrito guardado',
            noSalesHistoryForReturns: 'No hay historial de ventas disponible para devoluciones/cambios',
            returnExchangeFunctionality: 'Funcionalidad de devolución/cambio - Esto abriría una interfaz de gestión de devoluciones',
            cartSavedSuccessfully: '¡Carrito guardado exitosamente! Puede cargarlo más tarde.',
            noItemsInCartToSave: 'No hay artículos en el carrito para guardar',
            pleaseAddItemsToCartBeforeDiscount: 'Por favor agregue artículos al carrito antes de aplicar descuento',
            enterDiscountPercentage: 'Ingrese el porcentaje de descuento (0-100):',
            discountApplied: 'Descuento de {discount}% aplicado a todos los artículos',
            discountMustBeBetween: 'El descuento debe estar entre 0 y 100',
            enterOfferName: 'Ingrese el nombre de la oferta:',
            enterOfferDiscount: 'Ingrese el porcentaje de descuento de la oferta:',
            offerCreated: 'Oferta "{name}" creada con {discount}% de descuento',
            selectPrepaidType: 'Seleccione el tipo prepago:\n1. Tarjeta de Regalo\n2. Paquete de Servicio\n3. Membresía',
            enterAmount: 'Ingrese la cantidad:',
            prepaidCreated: 'Prepagado {type} creado por €{amount}',
            areYouSureClearCart: '¿Está seguro de que desea limpiar todos los artículos del carrito?',
            cartClearedSuccessfully: 'Carrito limpiado exitosamente',
            cartIsAlreadyEmpty: 'El carrito ya está vacío',
            stockFilterToggled: 'Filtro de stock alternado - Esto filtraría artículos basados en disponibilidad de stock',
            selectSearchType: 'Seleccione el tipo de búsqueda:\n1. Por Nombre\n2. Por Categoría\n3. Por Rango de Precio\n4. Por Código de Barras',
            enterSearchValue: 'Ingrese el valor de búsqueda:',
            advancedSearch: 'Búsqueda avanzada: {type} = {value}',
            welcomeTab: 'Pestaña Bienvenido - Esto navegaría a la página de bienvenida/panel',
            consultTab: 'Pestaña Consultar - Esto abriría la gestión de consultas',
            customerTab: 'Pestaña Cliente - Esto abriría la gestión de clientes',
            enrollTab: 'Pestaña Inscribir - Esto abriría la inscripción de clientes',
            repairTab: 'Pestaña Reparar - Esto abriría la gestión de reparaciones/servicios',
            moreTab: 'Pestaña Más - Esto mostraría opciones adicionales',
            languageSettings: 'Configuración de Idioma',
            selectLanguage: 'Seleccionar Idioma',
            applyLanguage: 'Aplicar Idioma',
            languageChanged: '¡Idioma cambiado exitosamente!'
        },
        FR: {
            welcome: 'Bienvenue',
            consult: 'Consulter',
            customer: 'Client',
            enroll: 'Inscrire',
            pos: 'POS',
            repair: 'Réparer',
            more: 'Plus',
            saloonPos: 'Salon POS',
            cart: 'PANIER',
            selectArticles: 'Sélectionner les Articles',
            billPayment: 'Paiement de facture',
            loadCart: 'Charger le panier',
            returnExchange: 'Retour / Échange',
            saveCart: 'Sauvegarder le panier',
            discount: 'Remise',
            createOffer: 'Créer une offre',
            prepaidItems: 'Articles prépayés',
            clearableServices: 'Services annulables',
            showArticlesOnStock: 'Afficher uniquement les articles en stock',
            advancedArticleSearch: 'Recherche avancée d\'articles',
            prepareCart: 'Préparer le Panier',
            hardwareStation: 'Station matérielle',
            payment: 'Paiement',
            receipt: 'Reçu',
            salesPaymentHistory: 'Historique des Ventes et Paiements',
            receiptsInvoices: 'Reçus et Factures',
            viewReceipt: 'Voir le Reçu',
            print: 'Imprimer',
            noReceiptsAvailable: 'Aucun reçu disponible',
            completeSaleToGenerate: 'Effectuez une vente pour générer des reçus',
            connectedDevices: 'Appareils Connectés',
            systemStatus: 'État du Système',
            barcodeScanner: 'Scanner de Code-barres',
            receiptPrinter: 'Imprimante de Reçus',
            cashDrawer: 'Tiroir-caisse',
            network: 'Réseau',
            database: 'Base de Données',
            backup: 'Sauvegarde',
            connected: 'Connecté',
            online: 'En Ligne',
            active: 'Actif',
            invoice: 'Facture #',
            customerName: 'Client',
            items: 'Articles',
            total: 'Total',
            paymentMethod: 'Méthode de Paiement',
            status: 'Statut',
            date: 'Date',
            noSalesHistory: 'Aucun historique de ventes disponible',
            consultButton: 'CONSULTER',
            goToCheckout: 'ALLER AU PAIEMENT',
            wasAddedToCart: 'a été ajouté à votre PANIER',
            selectCustomer: 'Sélectionner le Client',
            searchCustomers: 'Rechercher des clients...',
            walkInCustomer: 'Client Occasionnel',
            addNewCustomer: 'Ajouter un Nouveau Client',
            name: 'Nom',
            phone: 'Téléphone (optionnel)',
            email: 'Email (optionnel)',
            createCustomer: 'Créer le Client',
            creating: 'Création...',
            cancel: 'Annuler',
            paymentLabel: 'Paiement',
            amountPaid: 'Montant Payé',
            reference: 'Référence (optionnel)',
            balance: 'Solde',
            processing: 'Traitement...',
            completeSale: 'Finaliser la Vente',
            saleComplete: 'Vente Terminée !',
            totalAmount: 'Montant Total',
            done: 'Terminé',
            receiptDetails: 'Détails du Reçu',
            printReceipt: 'Imprimer le Reçu',
            close: 'Fermer',
            thankYouForBusiness: 'Merci pour votre commerce !',
            generatedOn: 'Généré le',
            barbershop: 'BARBERIE',
            subtotal: 'Sous-total',
            includedTax: 'Taxe incluse (20%)',
            qty: 'Qté',
            position: 'Position',
            totalEur: 'Total (EUR)',
            articleId: 'ID de l\'Article',
            searchOrScanArticle: 'Rechercher ou scanner l\'article',
            noItemsInCart: 'Aucun article dans le panier',
            noSearchResults: 'Aucun résultat de recherche',
            pleaseAddItemsToCart: 'Veuillez ajouter des articles au panier avant de procéder au paiement',
            cartLoadedSuccessfully: 'Panier chargé avec succès !',
            errorLoadingSavedCart: 'Erreur lors du chargement du panier sauvegardé',
            noSavedCartFound: 'Aucun panier sauvegardé trouvé',
            noSalesHistoryForReturns: 'Aucun historique de ventes disponible pour les retours/échanges',
            returnExchangeFunctionality: 'Fonctionnalité de retour/échange - Cela ouvrirait une interface de gestion des retours',
            cartSavedSuccessfully: 'Panier sauvegardé avec succès ! Vous pouvez le charger plus tard.',
            noItemsInCartToSave: 'Aucun article dans le panier à sauvegarder',
            pleaseAddItemsToCartBeforeDiscount: 'Veuillez ajouter des articles au panier avant d\'appliquer une remise',
            enterDiscountPercentage: 'Entrez le pourcentage de remise (0-100):',
            discountApplied: 'Remise de {discount}% appliquée à tous les articles',
            discountMustBeBetween: 'La remise doit être comprise entre 0 et 100',
            enterOfferName: 'Entrez le nom de l\'offre:',
            enterOfferDiscount: 'Entrez le pourcentage de remise de l\'offre:',
            offerCreated: 'Offre "{name}" créée avec {discount}% de remise',
            selectPrepaidType: 'Sélectionnez le type prépayé:\n1. Carte Cadeau\n2. Forfait de Service\n3. Adhésion',
            enterAmount: 'Entrez le montant:',
            prepaidCreated: 'Prépaiement {type} créé pour €{amount}',
            areYouSureClearCart: 'Êtes-vous sûr de vouloir vider tous les articles du panier ?',
            cartClearedSuccessfully: 'Panier vidé avec succès',
            cartIsAlreadyEmpty: 'Le panier est déjà vide',
            stockFilterToggled: 'Filtre de stock basculé - Cela filtrerait les articles selon la disponibilité du stock',
            selectSearchType: 'Sélectionnez le type de recherche:\n1. Par Nom\n2. Par Catégorie\n3. Par Fourchette de Prix\n4. Par Code-barres',
            enterSearchValue: 'Entrez la valeur de recherche:',
            advancedSearch: 'Recherche avancée: {type} = {value}',
            welcomeTab: 'Onglet Bienvenue - Cela naviguerait vers la page d\'accueil/tableau de bord',
            consultTab: 'Onglet Consulter - Cela ouvrirait la gestion des consultations',
            customerTab: 'Onglet Client - Cela ouvrirait la gestion des clients',
            enrollTab: 'Onglet Inscrire - Cela ouvrirait l\'inscription des clients',
            repairTab: 'Onglet Réparer - Cela ouvrirait la gestion des réparations/services',
            moreTab: 'Onglet Plus - Cela afficherait des options supplémentaires',
            languageSettings: 'Paramètres de Langue',
            selectLanguage: 'Sélectionner la Langue',
            applyLanguage: 'Appliquer la Langue',
                         languageChanged: 'Langue changée avec succès !'
         },
         PK: {
             welcome: 'خوش آمدید',
             consult: 'مشاورہ',
             customer: 'گاہک',
             enroll: 'انرول',
             pos: 'POS',
             repair: 'مرمت',
             more: 'مزید',
             saloonPos: 'سیلون POS',
             cart: 'کارٹ',
             selectArticles: 'آرٹیکلز منتخب کریں',
             billPayment: 'بل ادائیگی',
             loadCart: 'کارٹ لوڈ کریں',
             returnExchange: 'واپسی / تبادلہ',
             saveCart: 'کارٹ محفوظ کریں',
             discount: 'رعایت',
             createOffer: 'آفر بنائیں',
             prepaidItems: 'پیشگی آئٹمز',
             clearableServices: 'صاف کرنے کے قابل خدمات',
             showArticlesOnStock: 'صرف اسٹاک میں موجود آرٹیکلز دکھائیں',
             advancedArticleSearch: 'اعلی درجے کی آرٹیکل تلاش',
             prepareCart: 'کارٹ تیار کریں',
             hardwareStation: 'ہارڈویئر اسٹیشن',
             payment: 'ادائیگی',
             receipt: 'رسید',
             salesPaymentHistory: 'فروخت اور ادائیگی کی تاریخ',
             receiptsInvoices: 'رسید اور انوائس',
             viewReceipt: 'رسید دیکھیں',
             print: 'پرنٹ',
             noReceiptsAvailable: 'کوئی رسید دستیاب نہیں',
             completeSaleToGenerate: 'رسید بنانے کے لیے فروخت مکمل کریں',
             connectedDevices: 'منسلک آلات',
             systemStatus: 'سسٹم کی حالت',
             barcodeScanner: 'بارکوڈ سکینر',
             receiptPrinter: 'رسید پرنٹر',
             cashDrawer: 'نقد دراز',
             network: 'نیٹ ورک',
             database: 'ڈیٹا بیس',
             backup: 'بیک اپ',
             connected: 'منسلک',
             online: 'آن لائن',
             active: 'فعال',
             invoice: 'انوائس #',
             customerName: 'گاہک',
             items: 'آئٹمز',
             total: 'کل',
             paymentMethod: 'ادائیگی کا طریقہ',
             status: 'حیثیت',
             date: 'تاریخ',
             noSalesHistory: 'کوئی فروخت کی تاریخ دستیاب نہیں',
             consultButton: 'مشاورہ',
             goToCheckout: 'چیک آؤٹ پر جائیں',
             wasAddedToCart: 'آپ کے کارٹ میں شامل کیا گیا',
             selectCustomer: 'گاہک منتخب کریں',
             searchCustomers: 'گاہکوں کی تلاش...',
             walkInCustomer: 'واک ان گاہک',
             addNewCustomer: 'نیا گاہک شامل کریں',
             name: 'نام',
             phone: 'فون (اختیاری)',
             email: 'ای میل (اختیاری)',
             createCustomer: 'گاہک بنائیں',
             creating: 'بن رہا ہے...',
             cancel: 'منسوخ',
             paymentLabel: 'ادائیگی',
             amountPaid: 'ادائیگی کی گئی رقم',
             reference: 'حوالہ (اختیاری)',
             balance: 'بیلنس',
             processing: 'پروسیسنگ...',
             completeSale: 'فروخت مکمل کریں',
             saleComplete: 'فروخت مکمل!',
             totalAmount: 'کل رقم',
             done: 'مکمل',
             receiptDetails: 'رسید کی تفصیلات',
             printReceipt: 'رسید پرنٹ کریں',
             close: 'بند کریں',
             thankYouForBusiness: 'آپ کے کاروبار کے لیے شکریہ!',
             generatedOn: 'تاریخ پر تیار کیا گیا',
             barbershop: 'نائی کی دکان',
             subtotal: 'ذیلی کل',
             includedTax: 'شامل ٹیکس (20%)',
             qty: 'مقدار',
             position: 'پوزیشن',
             totalEur: 'کل (PKR)',
             articleId: 'آرٹیکل ID',
             searchOrScanArticle: 'آرٹیکل تلاش یا سکین کریں',
             noItemsInCart: 'کارٹ میں کوئی آئٹم نہیں',
             noSearchResults: 'کوئی تلاش کے نتائج نہیں',
             pleaseAddItemsToCart: 'براہ کرم ادائیگی کے لیے کارٹ میں آئٹمز شامل کریں',
             cartLoadedSuccessfully: 'کارٹ کامیابی سے لوڈ ہوا!',
             errorLoadingSavedCart: 'محفوظ کارٹ لوڈ کرنے میں خرابی',
             noSavedCartFound: 'کوئی محفوظ کارٹ نہیں ملا',
             noSalesHistoryForReturns: 'واپسی/تبادلہ کے لیے کوئی فروخت کی تاریخ دستیاب نہیں',
             returnExchangeFunctionality: 'واپسی/تبادلہ کی فعالیت - یہ واپسی کے انتظام کا انٹرفیس کھولے گا',
             cartSavedSuccessfully: 'کارٹ کامیابی سے محفوظ ہوا! آپ اسے بعد میں لوڈ کر سکتے ہیں۔',
             noItemsInCartToSave: 'محفوظ کرنے کے لیے کارٹ میں کوئی آئٹم نہیں',
             pleaseAddItemsToCartBeforeDiscount: 'رعایت لگانے سے پہلے براہ کرم کارٹ میں آئٹمز شامل کریں',
             enterDiscountPercentage: 'رعایت کا فیصد درج کریں (0-100):',
             discountApplied: '{discount}% کی رعایت تمام آئٹمز پر لاگو کی گئی',
             discountMustBeBetween: 'رعایت 0 اور 100 کے درمیان ہونی چاہیے',
             enterOfferName: 'آفر کا نام درج کریں:',
             enterOfferDiscount: 'آفر کی رعایت کا فیصد درج کریں:',
             offerCreated: 'آفر "{name}" {discount}% رعایت کے ساتھ بنائی گئی',
             selectPrepaidType: 'پیشگی کی قسم منتخب کریں:\n1. گفٹ کارڈ\n2. سروس پیکج\n3. رکنیت',
             enterAmount: 'رقم درج کریں:',
             prepaidCreated: 'پیشگی {type} {amount} PKR کے لیے بنائی گئی',
             areYouSureClearCart: 'کیا آپ واقعی کارٹ سے تمام آئٹمز صاف کرنا چاہتے ہیں؟',
             cartClearedSuccessfully: 'کارٹ کامیابی سے صاف ہوا',
             cartIsAlreadyEmpty: 'کارٹ پہلے سے خالی ہے',
             stockFilterToggled: 'اسٹاک فلٹر تبدیل کیا گیا - یہ اسٹاک کی دستیابی کے مطابق آئٹمز فلٹر کرے گا',
             selectSearchType: 'تلاش کی قسم منتخب کریں:\n1. نام کے ذریعے\n2. زمرے کے ذریعے\n3. قیمت کی حد کے ذریعے\n4. بارکوڈ کے ذریعے',
             enterSearchValue: 'تلاش کی قیمت درج کریں:',
             advancedSearch: 'اعلی درجے کی تلاش: {type} = {value}',
             welcomeTab: 'خوش آمدید ٹیب - یہ خوش آمدید/ڈیش بورڈ صفحے پر جائے گا',
             consultTab: 'مشاورہ ٹیب - یہ مشاورہ کے انتظام کو کھولے گا',
             customerTab: 'گاہک ٹیب - یہ گاہک کے انتظام کو کھولے گا',
             enrollTab: 'انرول ٹیب - یہ گاہک کی اندراج کو کھولے گا',
             repairTab: 'مرمت ٹیب - یہ مرمت/سروس کے انتظام کو کھولے گا',
             moreTab: 'مزید ٹیب - یہ اضافی اختیارات دکھائے گا',
             languageSettings: 'زبان کی ترتیبات',
             selectLanguage: 'زبان منتخب کریں',
             applyLanguage: 'زبان لاگو کریں',
             languageChanged: 'زبان کامیابی سے تبدیل ہوئی!'
         }
     };

    // Currency configuration
    const currencyConfig = {
        EN: { code: 'EUR', symbol: '€', name: 'Euro' },
        ES: { code: 'EUR', symbol: '€', name: 'Euro' },
        FR: { code: 'EUR', symbol: '€', name: 'Euro' },
        PK: { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee' }
    };

    // Get current currency info
    const getCurrentCurrency = () => {
        return currencyConfig[currentLanguage as keyof typeof currencyConfig] || currencyConfig.EN;
    };

    // Format currency
    const formatCurrency = (amount: number) => {
        const currency = getCurrentCurrency();
        return `${currency.symbol}${amount.toFixed(2)}`;
    };

    // Translation function
    const t = (key: string, params?: Record<string, string | number>) => {
        const translation = translations[currentLanguage as keyof typeof translations]?.[key as keyof typeof translations.EN] || translations.EN[key as keyof typeof translations.EN] || key;
        
        if (params) {
            return Object.entries(params).reduce((str, [param, value]) => {
                return str.replace(new RegExp(`{${param}}`, 'g'), String(value));
            }, translation);
        }
        
        return translation;
    };

    const subtotal = useMemo(() => 
        cart.reduce((sum, item) => sum + (item.price * item.qty), 0), [cart]
    );

    const totalDiscount = useMemo(() => 
        cart.reduce((sum, item) => sum + item.lineDiscount, 0), [cart]
    );

    const totalTax = useMemo(() => 
        cart.reduce((sum, item) => sum + ((item.price * item.qty - item.lineDiscount) * item.taxRate / 100), 0), [cart]
    );

    const grandTotal = useMemo(() => 
        Math.max(0, subtotal - totalDiscount + totalTax), [subtotal, totalDiscount, totalTax]
    );

    const balance = useMemo(() => 
        Math.max(0, grandTotal - paidAmount), [grandTotal, paidAmount]
    );

    useEffect(() => {
        loadItems();
        loadCustomers();
        loadSalesHistory();
        playPOSBeep();
    }, []);

    const playPOSBeep = () => {
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            console.log('Audio not supported or blocked by browser');
        }
    };

    const loadItems = async () => {
        try {
            const response = await axios.get('/api/pos/items');
            setItems(response.data);
        } catch (error) {
            console.error('Error loading items:', error);
        }
    };

    const loadCustomers = async () => {
        try {
            const response = await axios.get('/api/customers');
            setCustomers(response.data);
        } catch (error) {
            console.error('Error loading customers:', error);
        }
    };

    const loadSalesHistory = async () => {
        try {
            const response = await axios.get('/api/pos/sales');
            setSalesHistory(response.data);
        } catch (error) {
            console.error('Error loading sales history:', error);
        }
    };

    const viewReceipt = (sale: any) => {
        setSelectedReceipt(sale);
        setShowReceiptModal(true);
    };

    const printReceipt = (sale: any) => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            const receiptContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Receipt - ${sale.invoice_no || `INV-${sale.id}`}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
                        .receipt-info { margin-bottom: 20px; }
                        .items { margin-bottom: 20px; }
                        .total { border-top: 2px solid #333; padding-top: 10px; font-weight: bold; }
                        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
                        table { width: 100%; border-collapse: collapse; }
                        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
                        th { background-color: #f5f5f5; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>BARBERSHOP</h1>
                        <p>Receipt</p>
                    </div>
                    
                    <div class="receipt-info">
                        <p><strong>Invoice #:</strong> ${sale.invoice_no || `INV-${sale.id}`}</p>
                        <p><strong>Date:</strong> ${new Date(sale.created_at || Date.now()).toLocaleDateString()}</p>
                        <p><strong>Customer:</strong> ${sale.customer_name || 'Walk-in'}</p>
                        <p><strong>Status:</strong> ${sale.payment_status || 'Paid'}</p>
                    </div>
                    
                    <div class="items">
                        <table>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${sale.items ? sale.items.map((item: any) => `
                                    <tr>
                                        <td>${item.name}</td>
                                        <td>${item.qty}</td>
                                        <td>€${item.unit_price}</td>
                                        <td>€${(item.qty * item.unit_price).toFixed(2)}</td>
                                    </tr>
                                `).join('') : `
                                    <tr>
                                        <td>Service</td>
                                        <td>1</td>
                                        <td>€${sale.grand_total || sale.total || 0}</td>
                                        <td>€${sale.grand_total || sale.total || 0}</td>
                                    </tr>
                                `}
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="total">
                        <p><strong>Total Amount: €${sale.grand_total || sale.total || 0}</strong></p>
                    </div>
                    
                    <div class="footer">
                        <p>Thank you for your business!</p>
                        <p>Generated on ${new Date().toLocaleString()}</p>
                    </div>
                </body>
                </html>
            `;
            
            printWindow.document.write(receiptContent);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }
    };

    const addToCart = (item: POSItem) => {
        const existingItem = cart.find(cartItem => cartItem.id === item.id && cartItem.type === item.type);
        
        if (existingItem) {
            setCart(cart.map(cartItem => 
                cartItem.id === item.id && cartItem.type === item.type
                    ? { ...cartItem, qty: cartItem.qty + 1, lineTotal: (cartItem.qty + 1) * cartItem.price }
                    : cartItem
            ));
        } else {
            const newCartItem: CartItem = {
                ...item,
                qty: 1,
                lineTotal: item.price,
                lineDiscount: 0,
                taxRate: 0
            };
            setCart([...cart, newCartItem]);
        }
        
        playCartBeep();
    };

    const playCartBeep = () => {
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.05);
        } catch (error) {
            console.log('Audio not supported or blocked by browser');
        }
    };

    const playSuccessBeep = () => {
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);

            setTimeout(() => {
                const oscillator2 = audioContext.createOscillator();
                const gainNode2 = audioContext.createGain();

                oscillator2.connect(gainNode2);
                gainNode2.connect(audioContext.destination);

                oscillator2.frequency.setValueAtTime(1400, audioContext.currentTime);
                oscillator2.type = 'sine';

                gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

                oscillator2.start(audioContext.currentTime);
                oscillator2.stop(audioContext.currentTime + 0.1);
            }, 150);
        } catch (error) {
            console.log('Audio not supported or blocked by browser');
        }
    };

    const updateCartItem = (index: number, field: keyof CartItem, value: any) => {
        const updatedCart = [...cart];
        updatedCart[index] = { ...updatedCart[index], [field]: value };
        
        if (field === 'qty' || field === 'price' || field === 'lineDiscount' || field === 'taxRate') {
            const item = updatedCart[index];
            const lineSubtotal = item.qty * item.price - item.lineDiscount;
            const lineTax = lineSubtotal * item.taxRate / 100;
            updatedCart[index].lineTotal = lineSubtotal + lineTax;
        }
        
        setCart(updatedCart);
    };

    const removeFromCart = (index: number) => {
        setCart(cart.filter((_, i) => i !== index));
    };

    const clearCart = () => {
        setCart([]);
        setSelectedCustomer(null);
        setBarber('');
        setNotes('');
    };

    const createCustomer = async () => {
        try {
            setLoading(true);
            const response = await axios.post('/api/customers', newCustomer);
            setCustomers([response.data, ...customers]);
            setSelectedCustomer(response.data);
            setShowCustomerModal(false);
            setNewCustomer({ name: '', phone: '', email: '', notes: '' });
        } catch (error) {
            console.error('Error creating customer:', error);
        } finally {
            setLoading(false);
        }
    };

    const processSale = async () => {
        if (cart.length === 0) return;

        try {
            setLoading(true);
            
            const saleData = {
                customer_id: selectedCustomer?.id || null,
                barber: barber || null,
                items: cart.map(item => ({
                    item_type: item.type,
                    item_id: item.id,
                    name: item.name,
                    qty: item.qty,
                    unit_price: item.price,
                    line_discount: item.lineDiscount,
                    tax_rate: item.taxRate
                })),
                discount_total: totalDiscount,
                tax_total: totalTax,
                paid_total: paidAmount,
                payment_method: paymentMethod,
                notes: notes
            };

            const response = await axios.post('/api/pos/sales', saleData);
            setCurrentSale(response.data);
            setShowPaymentModal(false);
            setShowReceipt(true);
            clearCart();
            playSuccessBeep();
        } catch (error) {
            console.error('Error processing sale:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        (customer.phone && customer.phone.includes(customerSearch)) ||
        (customer.email && customer.email.toLowerCase().includes(customerSearch.toLowerCase()))
    );

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        playPOSBeep();
        
        // Handle different tab actions
        switch(tab) {
            case 'welcome':
                alert(t('welcomeTab'));
                break;
            case 'consult':
                alert(t('consultTab'));
                break;
            case 'customer':
                alert(t('customerTab'));
                break;
            case 'enroll':
                alert(t('enrollTab'));
                break;
            case 'pos':
                // Stay on current POS page
                break;
            case 'repair':
                alert(t('repairTab'));
                break;
            case 'more':
                alert(t('moreTab'));
                break;
        }
    };

    const handleLanguageChange = (language: string) => {
        setCurrentLanguage(language);
        setCurrentCurrency(currencyConfig[language as keyof typeof currencyConfig]?.code || 'EUR');
        setShowLanguageModal(false);
        playPOSBeep();
        alert(t('languageChanged'));
    };

    return (
        <div className="flex h-screen bg-white w-full overflow-hidden">
            {/* Top Header Bar */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-20 shadow-sm">
                <div className="flex items-center gap-8">
                    <button
                        onClick={onBack}
                        className="text-gray-500 hover:text-orange-500 transition-colors p-2 rounded-lg hover:bg-gray-50"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <span className="text-gray-800 font-bold text-2xl">{t('saloonPos')}</span>
                </div>
                <div className="flex items-center gap-8">
                    <nav className="flex items-center gap-8 text-sm font-medium text-gray-600">
                        <button 
                            onClick={() => handleTabChange('welcome')}
                            className={`hover:text-orange-500 cursor-pointer transition-colors ${
                                activeTab === 'welcome' ? 'text-orange-500' : 'text-gray-600'
                            }`}
                        >
                            {t('welcome')}
                        </button>
                        <button 
                            onClick={() => handleTabChange('consult')}
                            className={`hover:text-orange-500 cursor-pointer transition-colors ${
                                activeTab === 'consult' ? 'text-orange-500' : 'text-gray-600'
                            }`}
                        >
                            {t('consult')}
                        </button>
                        <button 
                            onClick={() => handleTabChange('customer')}
                            className={`hover:text-orange-500 cursor-pointer transition-colors ${
                                activeTab === 'customer' ? 'text-orange-500' : 'text-gray-600'
                            }`}
                        >
                            {t('customer')}
                        </button>
                        <button 
                            onClick={() => handleTabChange('enroll')}
                            className={`hover:text-orange-500 cursor-pointer transition-colors ${
                                activeTab === 'enroll' ? 'text-orange-500' : 'text-gray-600'
                            }`}
                        >
                            {t('enroll')}
                        </button>
                        <button 
                            onClick={() => handleTabChange('pos')}
                            className={`hover:text-orange-500 cursor-pointer transition-colors ${
                                activeTab === 'pos' ? 'text-orange-500 font-semibold border-b-2 border-orange-500 pb-1' : 'text-gray-600'
                            }`}
                        >
                            {t('pos')}
                        </button>
                        <button 
                            onClick={() => handleTabChange('repair')}
                            className={`hover:text-orange-500 cursor-pointer transition-colors ${
                                activeTab === 'repair' ? 'text-orange-500' : 'text-gray-600'
                            }`}
                        >
                            {t('repair')}
                        </button>
                        <button 
                            onClick={() => handleTabChange('more')}
                            className={`hover:text-orange-500 cursor-pointer transition-colors ${
                                activeTab === 'more' ? 'text-orange-500' : 'text-gray-600'
                            }`}
                        >
                            {t('more')}
                        </button>
                    </nav>
                    <div className="flex items-center gap-6">
                        <span className="text-sm text-gray-700 font-medium">Jane Doe</span>
                        <div className="flex items-center gap-3">
                            <button className="p-2 text-gray-500 hover:text-orange-500 hover:bg-gray-50 rounded-lg transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </button>
                            <button className="p-2 text-gray-500 hover:text-orange-500 hover:bg-gray-50 rounded-lg transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.83 2.83l4.244 4.244M20 12h-5M4.83 17.17l4.244-4.244M20 12v5M4.83 6.83l4.244 4.244" />
                                </svg>
                            </button>
                            <button className="p-2 text-gray-500 hover:text-orange-500 hover:bg-gray-50 rounded-lg transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </button>
                            <button className="p-2 text-gray-500 hover:text-orange-500 hover:bg-gray-50 rounded-lg transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                                </svg>
                            </button>
                            <button 
                                onClick={() => setShowLanguageModal(true)}
                                className="text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors cursor-pointer"
                            >
                                {currentLanguage}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction Flow Indicator */}
            <div className="absolute top-16 left-0 right-0 h-14 bg-gray-100 border-b-2 border-gray-300 flex items-center px-8">
                <div className="flex items-center gap-8">
                    <button 
                        onClick={() => setActiveStep(1)}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                            activeStep === 1 
                                ? 'bg-white border-2 border-orange-500 shadow-md' 
                                : 'bg-gray-200 border-2 border-gray-300 hover:bg-gray-300 hover:border-gray-400'
                        }`}
                    >
                        <div className={`w-8 h-8 ${activeStep === 1 ? 'bg-orange-500 text-white' : 'bg-gray-400 text-gray-600'} rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-colors`}>1</div>
                        <span className={`${activeStep === 1 ? 'text-orange-600 font-semibold' : 'text-gray-600'} text-base transition-colors`}>Prepare Cart</span>
                    </button>
                    <button 
                        onClick={() => setActiveStep(2)}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                            activeStep === 2 
                                ? 'bg-white border-2 border-orange-500 shadow-md' 
                                : 'bg-gray-200 border-2 border-gray-300 hover:bg-gray-300 hover:border-gray-400'
                        }`}
                    >
                        <div className={`w-8 h-8 ${activeStep === 2 ? 'bg-orange-500 text-white' : 'bg-gray-400 text-gray-600'} rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-colors`}>2</div>
                        <span className={`${activeStep === 2 ? 'text-orange-600 font-semibold' : 'text-gray-600'} text-base transition-colors`}>Hardware station</span>
                    </button>
                    <button 
                        onClick={() => setActiveStep(3)}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                            activeStep === 3 
                                ? 'bg-white border-2 border-orange-500 shadow-md' 
                                : 'bg-gray-200 border-2 border-gray-300 hover:bg-gray-300 hover:border-gray-400'
                        }`}
                    >
                        <div className={`w-8 h-8 ${activeStep === 3 ? 'bg-orange-500 text-white' : 'bg-gray-400 text-gray-600'} rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-colors`}>3</div>
                        <span className={`${activeStep === 3 ? 'text-orange-600 font-semibold' : 'text-gray-600'} text-base transition-colors`}>Payment</span>
                    </button>
                    <button 
                        onClick={() => setActiveStep(4)}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                            activeStep === 4 
                                ? 'bg-white border-2 border-orange-500 shadow-md' 
                                : 'bg-gray-200 border-2 border-gray-300 hover:bg-gray-300 hover:border-gray-400'
                        }`}
                    >
                        <div className={`w-8 h-8 ${activeStep === 4 ? 'bg-orange-500 text-white' : 'bg-gray-400 text-gray-600'} rounded-full flex items-center justify-center text-sm font-bold shadow-sm transition-colors`}>4</div>
                        <span className={`${activeStep === 4 ? 'text-orange-600 font-semibold' : 'text-gray-600'} text-base transition-colors`}>Receipt</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex h-full pt-28">
                {activeStep === 1 && (
                    <>
                        {/* Left Panel - Cart and Customer */}
                        <div className="w-1/3 flex flex-col h-full border-r-2 border-gray-300">
                    {/* Add Customer Section */}
                    <div className="p-4 border-b-2 border-gray-300">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border-2 border-gray-200 shadow-sm">
                            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-gray-700 font-medium">Add customer</span>
                        </div>
                    </div>

                    {/* Cart Section */}
                    <div className="flex-1 p-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">{t('cart')}</h3>
                        
                        {/* Cart Table Header */}
                        <div className="grid grid-cols-12 gap-2 mb-3 text-sm font-medium text-gray-600 border-b-2 border-gray-300 pb-2">
                            <div className="col-span-2">{t('qty')}</div>
                            <div className="col-span-8">{t('position')}</div>
                            <div className="col-span-2 text-right">Total ({getCurrentCurrency().code})</div>
                        </div>

                        {/* Cart Items */}
                        <div className="space-y-2 mb-4">
                            {cart.map((item, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 items-center py-2 border-b-2 border-gray-200 hover:bg-gray-50 rounded-lg px-1 transition-colors shadow-sm">
                                    <div className="col-span-2 text-sm font-medium">{item.qty}</div>
                                    <div className="col-span-8 text-sm text-gray-700">{item.name}</div>
                                                                         <div className="col-span-2 text-right">
                                         <div className="flex items-center justify-between">
                                             <span className="text-sm font-medium">{formatCurrency(item.lineTotal)}</span>
                                            <button
                                                onClick={() => removeFromCart(index)}
                                                className="text-red-500 hover:text-red-700 ml-2 p-1 hover:bg-red-50 rounded border border-red-200"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {cart.length === 0 && (
                                <div className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-300 rounded-lg">
                                    <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    <p className="text-sm">{t('noItemsInCart')}</p>
                                </div>
                            )}
                        </div>

                        {/* Cart Summary */}
                        <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-300 shadow-lg">
                            <div className="space-y-2 text-sm">
                                                                 <div className="flex justify-between border-b border-gray-200 pb-2">
                                     <span className="text-gray-600">{t('subtotal')}</span>
                                     <span className="font-medium">{formatCurrency(subtotal)}</span>
                                 </div>
                                 <div className="flex justify-between border-b border-gray-200 pb-2">
                                     <span className="text-gray-600">{t('includedTax')}</span>
                                     <span className="font-medium">{formatCurrency(totalTax)}</span>
                                 </div>
                                 <div className="border-t-2 border-gray-300 pt-2">
                                     <div className="flex justify-between font-bold text-lg">
                                         <span>{t('total')}</span>
                                         <span>{formatCurrency(grandTotal)}</span>
                                     </div>
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle Panel - Select Articles */}
                <div className="w-1/3 flex flex-col h-full border-r-2 border-gray-300">
                    <div className="p-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">{t('selectArticles')}</h3>
                        
                        {/* Search Bar */}
                        <div className="flex gap-2 mb-4">
                            <input
                                type="text"
                                placeholder={t('searchOrScanArticle')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 px-3 py-2 border-2 border-gray-300 rounded text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors shadow-sm"
                            />
                            <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded transition-colors border-2 border-gray-200">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1zm12 0h2a1 1 0 001-1V6a1 1 0 00-1-1h-2a1 1 0 00-1 1v1a1 1 0 001 1zM5 20h2a1 1 0 001-1v-1a1 1 0 00-1-1H5a1 1 0 00-1 1v1a1 1 0 001 1z" />
                                </svg>
                            </button>
                        </div>

                        {/* Articles Table Header */}
                        <div className="grid grid-cols-12 gap-2 mb-3 text-sm font-medium text-gray-600 border-b-2 border-gray-300 pb-2">
                            <div className="col-span-6">{t('articleId')}</div>
                            <div className="col-span-4">{t('position')}</div>
                            <div className="col-span-2 text-right">Total ({getCurrentCurrency().code})</div>
                        </div>

                        {/* Articles List */}
                        <div className="space-y-2 border-2 border-gray-200 rounded-lg p-2">
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item) => (
                                    <div 
                                        key={`${item.type}-${item.id}`} 
                                        className="grid grid-cols-12 gap-2 items-center py-3 border-b-2 border-gray-200 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 cursor-pointer rounded-lg px-2 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-200 hover:border-orange-300 group" 
                                        onClick={() => addToCart(item)}
                                    >
                                        <div className="col-span-6 text-sm text-gray-700 group-hover:text-gray-900 group-hover:font-medium transition-all duration-300">{item.id}</div>
                                        <div className="col-span-4 text-sm text-gray-700 group-hover:text-gray-900 group-hover:font-medium transition-all duration-300">{item.name}</div>
                                        <div className="col-span-2 text-right text-sm font-medium text-orange-600 group-hover:text-orange-700 group-hover:text-base transition-all duration-300">{formatCurrency(item.price)}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-300 rounded-lg">
                                                                         <p className="text-sm">{t('noSearchResults')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel - Action Buttons */}
                <div className="w-1/3 flex flex-col h-full">
                    <div className="p-4">
                                                 {/* Action Buttons Grid */}
                         <div className="grid grid-cols-3 gap-3 mb-6 border-2 border-gray-300 rounded-xl p-4 shadow-lg">
                             <button 
                                 onClick={() => {
                                     if (cart.length === 0) {
                                         alert('Please add items to cart before proceeding to payment');
                                         return;
                                     }
                                     setShowPaymentModal(true);
                                     playPOSBeep();
                                 }}
                                 className={`p-4 rounded-lg font-medium text-sm transition-all duration-200 flex flex-col items-center justify-center h-20 ${
                                     cart.length > 0 
                                         ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                                         : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                 }`}
                             >
                                 <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                 </svg>
                                                                   <span className="text-xs">{t('billPayment')}</span>
                             </button>
                             
                             <button 
                                 onClick={() => {
                                     const savedCart = localStorage.getItem('savedCart');
                                     if (savedCart) {
                                         try {
                                             const parsedCart = JSON.parse(savedCart);
                                             setCart(parsedCart);
                                             alert('Cart loaded successfully!');
                                             playPOSBeep();
                                         } catch (error) {
                                             alert('Error loading saved cart');
                                         }
                                     } else {
                                         alert('No saved cart found');
                                     }
                                 }}
                                 className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-4 rounded-lg font-medium text-sm transition-all duration-200 flex flex-col items-center justify-center h-20 shadow-sm hover:shadow-md transform hover:scale-105 border border-gray-200"
                             >
                                 <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                 </svg>
                                                                   <span className="text-xs">{t('loadCart')}</span>
                             </button>
                             
                             <button 
                                 onClick={() => {
                                     if (salesHistory.length === 0) {
                                         alert('No sales history available for returns/exchanges');
                                         return;
                                     }
                                     // Show return/exchange modal or navigate to returns section
                                     alert('Return/Exchange functionality - This would open a returns management interface');
                                     playPOSBeep();
                                 }}
                                 className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-4 rounded-lg font-medium text-sm transition-all duration-200 flex flex-col items-center justify-center h-20 shadow-sm hover:shadow-md transform hover:scale-105 border border-gray-200"
                             >
                                 <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                 </svg>
                                                                   <span className="text-xs">{t('returnExchange')}</span>
                             </button>
                             
                             <button 
                                 onClick={() => {
                                     if (cart.length > 0) {
                                         localStorage.setItem('savedCart', JSON.stringify(cart));
                                         alert('Cart saved successfully! You can load it later.');
                                         playPOSBeep();
                                     } else {
                                         alert('No items in cart to save');
                                     }
                                 }}
                                 className={`p-4 rounded-lg font-medium text-sm transition-all duration-200 flex flex-col items-center justify-center h-20 ${
                                     cart.length > 0 
                                         ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-sm hover:shadow-md transform hover:scale-105 border border-gray-200' 
                                         : 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-100'
                                 }`}
                             >
                                 <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                 </svg>
                                                                   <span className="text-xs">{t('saveCart')}</span>
                             </button>
                             
                             <button 
                                 onClick={() => {
                                     if (cart.length === 0) {
                                         alert('Please add items to cart before applying discount');
                                         return;
                                     }
                                     const discountPercent = prompt('Enter discount percentage (0-100):');
                                     if (discountPercent && !isNaN(Number(discountPercent))) {
                                         const discount = Number(discountPercent);
                                         if (discount >= 0 && discount <= 100) {
                                             setCart(cart.map(item => ({
                                                 ...item,
                                                 lineDiscount: (item.price * item.qty * discount) / 100,
                                                 lineTotal: (item.price * item.qty) - ((item.price * item.qty * discount) / 100)
                                             })));
                                             alert(`Discount of ${discount}% applied to all items`);
                                             playPOSBeep();
                                         } else {
                                             alert('Discount must be between 0 and 100');
                                         }
                                     }
                                 }}
                                 className={`p-4 rounded-lg font-medium text-sm transition-all duration-200 flex flex-col items-center justify-center h-20 ${
                                     cart.length > 0 
                                         ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-sm hover:shadow-md transform hover:scale-105 border border-gray-200' 
                                         : 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-100'
                                 }`}
                             >
                                 <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                 </svg>
                                                                   <span className="text-xs">{t('discount')}</span>
                             </button>
                             
                             <button 
                                 onClick={() => {
                                     // Create offer functionality - could open a modal to create package deals
                                     const offerName = prompt('Enter offer name:');
                                     if (offerName) {
                                         const offerDiscount = prompt('Enter offer discount percentage:');
                                         if (offerDiscount && !isNaN(Number(offerDiscount))) {
                                             // This would typically save to database
                                             alert(`Offer "${offerName}" created with ${offerDiscount}% discount`);
                                             playPOSBeep();
                                         }
                                     }
                                 }}
                                 className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-4 rounded-lg font-medium text-sm transition-all duration-200 flex flex-col items-center justify-center h-20 shadow-sm hover:shadow-md transform hover:scale-105 border border-gray-200"
                             >
                                 <span className="text-lg font-bold mb-1 text-gray-700">CO</span>
                                                                   <span className="text-xs">{t('createOffer')}</span>
                             </button>
                             
                             <button 
                                 onClick={() => {
                                     // Prepaid items functionality - could show prepaid services or gift cards
                                     const prepaidType = prompt('Select prepaid type:\n1. Gift Card\n2. Service Package\n3. Membership');
                                     if (prepaidType) {
                                         const amount = prompt('Enter amount:');
                                         if (amount && !isNaN(Number(amount))) {
                                             alert(`Prepaid ${prepaidType} created for €${amount}`);
                                             playPOSBeep();
                                         }
                                     }
                                 }}
                                 className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-4 rounded-lg font-medium text-sm transition-all duration-200 flex flex-col items-center justify-center h-20 shadow-sm hover:shadow-md transform hover:scale-105 border border-gray-200"
                             >
                                 <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                 </svg>
                                                                   <span className="text-xs">{t('prepaidItems')}</span>
                             </button>
                             
                             <button 
                                 onClick={() => {
                                     if (cart.length > 0) {
                                         if (confirm('Are you sure you want to clear all items from the cart?')) {
                                             clearCart();
                                             alert('Cart cleared successfully');
                                             playPOSBeep();
                                         }
                                     } else {
                                         alert('Cart is already empty');
                                     }
                                 }}
                                 className={`p-4 rounded-lg font-medium text-sm transition-all duration-200 flex flex-col items-center justify-center h-20 ${
                                     cart.length > 0 
                                         ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-sm hover:shadow-md transform hover:scale-105 border border-gray-200' 
                                         : 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-100'
                                 }`}
                             >
                                 <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                 </svg>
                                                                   <span className="text-xs">{t('clearableServices')}</span>
                             </button>
                         </div>

                                                 {/* Toggle and Search */}
                         <div className="space-y-3 mb-6 border-2 border-gray-300 rounded-xl p-4 shadow-lg">
                             <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                                 <span className="text-sm text-gray-600 font-medium">Show articles on stock only</span>
                                 <button 
                                     onClick={() => {
                                         // Toggle stock filter functionality
                                         alert('Stock filter toggled - This would filter items based on stock availability');
                                         playPOSBeep();
                                     }}
                                     className="w-10 h-6 bg-gray-300 hover:bg-gray-400 rounded-full relative border-2 border-gray-400 transition-colors cursor-pointer"
                                 >
                                     <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow-sm transition-transform"></div>
                                 </button>
                             </div>
                             <button 
                                 onClick={() => {
                                     // Advanced search functionality
                                     const searchType = prompt('Select search type:\n1. By Name\n2. By Category\n3. By Price Range\n4. By Barcode');
                                     if (searchType) {
                                         const searchValue = prompt('Enter search value:');
                                         if (searchValue) {
                                             alert(`Advanced search: ${searchType} = ${searchValue}`);
                                             playPOSBeep();
                                         }
                                     }
                                 }}
                                 className="flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 transition-colors cursor-pointer w-full p-2 rounded hover:bg-gray-50"
                             >
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                 </svg>
                                 <span className="font-medium">Advanced article search</span>
                             </button>
                         </div>
                    </div>
                </div>
                    </>
                )}

                {/* Step 2: Hardware Station */}
                {activeStep === 2 && (
                    <div className="w-full flex flex-col h-full p-8">
                        <div className="bg-white rounded-lg border-2 border-gray-300 p-6 shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Hardware Station</h2>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Connected Devices</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between p-2 bg-green-100 rounded">
                                            <span className="text-sm font-medium">Barcode Scanner</span>
                                            <span className="text-green-600 text-xs">✓ Connected</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 bg-green-100 rounded">
                                            <span className="text-sm font-medium">Receipt Printer</span>
                                            <span className="text-green-600 text-xs">✓ Connected</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 bg-green-100 rounded">
                                            <span className="text-sm font-medium">Cash Drawer</span>
                                            <span className="text-green-600 text-xs">✓ Connected</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-3">System Status</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between p-2 bg-blue-100 rounded">
                                            <span className="text-sm font-medium">Network</span>
                                            <span className="text-blue-600 text-xs">✓ Online</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 bg-blue-100 rounded">
                                            <span className="text-sm font-medium">Database</span>
                                            <span className="text-blue-600 text-xs">✓ Connected</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 bg-blue-100 rounded">
                                            <span className="text-sm font-medium">Backup</span>
                                            <span className="text-blue-600 text-xs">✓ Active</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Payment/Sales */}
                {activeStep === 3 && (
                    <div className="w-full flex flex-col h-full p-8">
                        <div className="bg-white rounded-lg border-2 border-gray-300 p-6 shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sales & Payment History</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border-2 border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border-2 border-gray-300 p-3 text-left font-semibold">Invoice #</th>
                                            <th className="border-2 border-gray-300 p-3 text-left font-semibold">Customer</th>
                                            <th className="border-2 border-gray-300 p-3 text-left font-semibold">Items</th>
                                            <th className="border-2 border-gray-300 p-3 text-left font-semibold">Total</th>
                                            <th className="border-2 border-gray-300 p-3 text-left font-semibold">Payment Method</th>
                                            <th className="border-2 border-gray-300 p-3 text-left font-semibold">Status</th>
                                            <th className="border-2 border-gray-300 p-3 text-left font-semibold">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {salesHistory.length > 0 ? (
                                            salesHistory.map((sale, index) => (
                                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                                    <td className="border-2 border-gray-300 p-3 text-sm">{sale.invoice_no || `INV-${sale.id}`}</td>
                                                    <td className="border-2 border-gray-300 p-3 text-sm">{sale.customer_name || 'Walk-in'}</td>
                                                    <td className="border-2 border-gray-300 p-3 text-sm">{sale.items_count || sale.items?.length || 0}</td>
                                                    <td className="border-2 border-gray-300 p-3 text-sm font-medium">€{sale.grand_total || sale.total || 0}</td>
                                                    <td className="border-2 border-gray-300 p-3 text-sm capitalize">{sale.payment_method || 'Cash'}</td>
                                                    <td className="border-2 border-gray-300 p-3 text-sm">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            sale.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                                                            sale.payment_status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                            {sale.payment_status || 'Paid'}
                                                        </span>
                                                    </td>
                                                    <td className="border-2 border-gray-300 p-3 text-sm">{new Date(sale.created_at || Date.now()).toLocaleDateString()}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={7} className="border-2 border-gray-300 p-8 text-center text-gray-500">
                                                    No sales history available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Receipts */}
                {activeStep === 4 && (
                    <div className="w-full flex flex-col h-full p-8">
                        <div className="bg-white rounded-lg border-2 border-gray-300 p-6 shadow-lg">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Receipts & Invoices</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {salesHistory.length > 0 ? (
                                    salesHistory.map((sale, index) => (
                                        <div key={index} className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer">
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="font-semibold text-gray-800">Invoice #{sale.invoice_no || `INV-${sale.id}`}</h3>
                                                <span className="text-xs text-gray-500">{new Date(sale.created_at || Date.now()).toLocaleDateString()}</span>
                                            </div>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Customer:</span>
                                                    <span className="font-medium">{sale.customer_name || 'Walk-in'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Items:</span>
                                                    <span className="font-medium">{sale.items_count || sale.items?.length || 0}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Total:</span>
                                                    <span className="font-bold text-lg text-orange-600">€{sale.grand_total || sale.total || 0}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Status:</span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        sale.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                                                        sale.payment_status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {sale.payment_status || 'Paid'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex gap-2">
                                                <button 
                                                    onClick={() => viewReceipt(sale)}
                                                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                                                >
                                                    View Receipt
                                                </button>
                                                <button 
                                                    onClick={() => printReceipt(sale)}
                                                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                                                >
                                                    Print
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center text-gray-500 py-12">
                                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="text-lg font-medium">No receipts available</p>
                                        <p className="text-sm">Complete a sale to generate receipts</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Navigation - Only show on Step 1 */}
            {activeStep === 1 && (
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-white border-t-2 border-gray-200 flex items-center justify-between px-8 shadow-lg">
                    {/* <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        CONSULT
                    </button> */}
                    <button 
                        onClick={() => {
                            setShowPaymentModal(true);
                            playPOSBeep();
                        }}
                        disabled={cart.length === 0}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        GO TO CHECKOUT
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Notification */}
            {cart.length > 0 && (
                <div className="absolute bottom-20 right-6 bg-orange-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
                    <span className="text-sm font-medium">
                        {cart[cart.length - 1]?.name} was added to your CART
                    </span>
                    <button className="text-white hover:text-orange-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Customer Selection Modal */}
            {showCustomerModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
                        <h3 className="text-lg font-bold mb-4">Select Customer</h3>
                        
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Search customers..."
                                value={customerSearch}
                                onChange={(e) => setCustomerSearch(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                            />
                        </div>

                        <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                            <button
                                onClick={() => {
                                    setSelectedCustomer(null);
                                    setShowCustomerModal(false);
                                }}
                                className="w-full text-left p-2 hover:bg-gray-100 rounded"
                            >
                                <span className="font-semibold">Walk-in Customer</span>
                            </button>
                            {filteredCustomers.map((customer) => (
                                <button
                                    key={customer.id}
                                    onClick={() => {
                                        setSelectedCustomer(customer);
                                        setShowCustomerModal(false);
                                    }}
                                    className="w-full text-left p-2 hover:bg-gray-100 rounded"
                                >
                                    <div className="font-semibold">{customer.name}</div>
                                    {customer.phone && <div className="text-sm text-gray-600">{customer.phone}</div>}
                                </button>
                            ))}
                        </div>

                        <div className="border-t pt-4">
                            <h4 className="font-semibold mb-2">Add New Customer</h4>
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={newCustomer.name}
                                    onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="Phone (optional)"
                                    value={newCustomer.phone}
                                    onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                />
                                <input
                                    type="email"
                                    placeholder="Email (optional)"
                                    value={newCustomer.email}
                                    onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                />
                                <button
                                    onClick={createCustomer}
                                    disabled={!newCustomer.name || loading}
                                    className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Creating...' : 'Create Customer'}
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowCustomerModal(false)}
                            className="mt-4 w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-bold mb-4">Payment</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                >
                                    <option value="cash">Cash</option>
                                    <option value="card">Card</option>
                                    <option value="bank">Bank Transfer</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={paidAmount}
                                    onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reference (optional)</label>
                                <input
                                    type="text"
                                    value={paymentReference}
                                    onChange={(e) => setPaymentReference(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                />
                            </div>

                            <div className="bg-gray-50 p-3 rounded">
                                <div className="flex justify-between mb-1">
                                    <span>Total:</span>
                                    <span>${grandTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between mb-1">
                                    <span>Paid:</span>
                                    <span>${paidAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-semibold">
                                    <span>Balance:</span>
                                    <span className={balance > 0 ? 'text-red-600' : 'text-green-600'}>
                                        ${balance.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-6">
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={processSale}
                                disabled={loading}
                                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : 'Complete Sale'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Receipt Modal */}
            {showReceipt && currentSale && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
                        <div className="text-center mb-4">
                            <h3 className="text-lg font-bold">Sale Complete!</h3>
                            <p className="text-sm text-gray-600">Invoice: {currentSale.invoice_no}</p>
                        </div>

                        <div className="bg-gray-50 p-4 rounded mb-4">
                            <div className="flex justify-between mb-2">
                                <span>Total Amount:</span>
                                <span className="font-bold">${currentSale.grand_total}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Status:</span>
                                <span className={`font-semibold ${
                                    currentSale.payment_status === 'paid' ? 'text-green-600' : 
                                    currentSale.payment_status === 'partial' ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                    {currentSale.payment_status.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setShowReceipt(false);
                                    setCurrentSale(null);
                                }}
                                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Receipt View Modal */}
            {showReceiptModal && selectedReceipt && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Receipt Details</h3>
                            <button
                                onClick={() => {
                                    setShowReceiptModal(false);
                                    setSelectedReceipt(null);
                                }}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-semibold text-gray-600">Invoice #:</span>
                                    <p className="text-gray-800">{selectedReceipt.invoice_no || `INV-${selectedReceipt.id}`}</p>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-600">Date:</span>
                                    <p className="text-gray-800">{new Date(selectedReceipt.created_at || Date.now()).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-600">Customer:</span>
                                    <p className="text-gray-800">{selectedReceipt.customer_name || 'Walk-in'}</p>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-600">Status:</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        selectedReceipt.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                                        selectedReceipt.payment_status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {selectedReceipt.payment_status || 'Paid'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h4 className="font-semibold text-gray-800 mb-3">Items</h4>
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Item</th>
                                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Qty</th>
                                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Price</th>
                                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedReceipt.items ? selectedReceipt.items.map((item: any, index: number) => (
                                            <tr key={index} className="border-t border-gray-200">
                                                <td className="px-4 py-2 text-sm text-gray-800">{item.name}</td>
                                                <td className="px-4 py-2 text-sm text-gray-800">{item.qty}</td>
                                                <td className="px-4 py-2 text-sm text-gray-800">€{item.unit_price}</td>
                                                <td className="px-4 py-2 text-sm text-gray-800">€{(item.qty * item.unit_price).toFixed(2)}</td>
                                            </tr>
                                        )) : (
                                            <tr className="border-t border-gray-200">
                                                <td className="px-4 py-2 text-sm text-gray-800">Service</td>
                                                <td className="px-4 py-2 text-sm text-gray-800">1</td>
                                                <td className="px-4 py-2 text-sm text-gray-800">€{selectedReceipt.grand_total || selectedReceipt.total || 0}</td>
                                                <td className="px-4 py-2 text-sm text-gray-800">€{selectedReceipt.grand_total || selectedReceipt.total || 0}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
                                <span className="text-2xl font-bold text-orange-600">€{selectedReceipt.grand_total || selectedReceipt.total || 0}</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => printReceipt(selectedReceipt)}
                                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                            >
                                Print Receipt
                            </button>
                            <button
                                onClick={() => {
                                    setShowReceiptModal(false);
                                    setSelectedReceipt(null);
                                }}
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                            >
                                Close
                            </button>
                        </div>
                                         </div>
                 </div>
             )}

             {/* Language Selection Modal */}
             {showLanguageModal && (
                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                     <div className="bg-white rounded-lg p-6 w-96">
                         <div className="flex justify-between items-center mb-6">
                             <h3 className="text-xl font-bold text-gray-800">{t('languageSettings')}</h3>
                             <button
                                 onClick={() => setShowLanguageModal(false)}
                                 className="text-gray-500 hover:text-gray-700"
                             >
                                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                 </svg>
                             </button>
                         </div>

                         <div className="space-y-3">
                             <button
                                 onClick={() => handleLanguageChange('EN')}
                                 className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between ${
                                     currentLanguage === 'EN' 
                                         ? 'border-orange-500 bg-orange-50 text-orange-700' 
                                         : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                                 }`}
                             >
                                 <div className="flex flex-col items-start">
                                     <span className="font-medium">English</span>
                                     <span className="text-xs text-gray-500">€ Euro</span>
                                 </div>
                                 <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded">EN</span>
                             </button>
                             
                             <button
                                 onClick={() => handleLanguageChange('ES')}
                                 className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between ${
                                     currentLanguage === 'ES' 
                                         ? 'border-orange-500 bg-orange-50 text-orange-700' 
                                         : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                                 }`}
                             >
                                 <div className="flex flex-col items-start">
                                     <span className="font-medium">Español</span>
                                     <span className="text-xs text-gray-500">€ Euro</span>
                                 </div>
                                 <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded">ES</span>
                             </button>
                             
                             <button
                                 onClick={() => handleLanguageChange('FR')}
                                 className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between ${
                                     currentLanguage === 'FR' 
                                         ? 'border-orange-500 bg-orange-50 text-orange-700' 
                                         : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                                 }`}
                             >
                                 <div className="flex flex-col items-start">
                                     <span className="font-medium">Français</span>
                                     <span className="text-xs text-gray-500">€ Euro</span>
                                 </div>
                                 <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded">FR</span>
                             </button>

                             <button
                                 onClick={() => handleLanguageChange('PK')}
                                 className={`w-full p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between ${
                                     currentLanguage === 'PK' 
                                         ? 'border-orange-500 bg-orange-50 text-orange-700' 
                                         : 'border-gray-200 hover:border-orange-300 hover:bg-gray-50'
                                 }`}
                             >
                                 <div className="flex flex-col items-start">
                                     <span className="font-medium">اردو (Urdu)</span>
                                     <span className="text-xs text-gray-500">₨ Pakistani Rupee</span>
                                 </div>
                                 <span className="text-sm font-semibold bg-gray-100 px-2 py-1 rounded">PK</span>
                             </button>
                         </div>

                         <div className="mt-6 pt-4 border-t border-gray-200">
                             <button
                                 onClick={() => setShowLanguageModal(false)}
                                 className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                             >
                                 {t('cancel')}
                             </button>
                         </div>
                     </div>
                 </div>
             )}
         </div>
     );
 };

export default POS;
