# Info.plist — patch à appliquer après `npx cap add ios`

Ouvre `frontend/ios/App/App/Info.plist` et ajoute les clés suivantes
avant la fermeture `</dict>` finale (juste avant `</plist>`).

## 1. Exception ATS pour l'IP de ton backend

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <false/>
    <key>NSExceptionDomains</key>
    <dict>
        <key>102.50.247.101</key>
        <dict>
            <key>NSExceptionRequiresForwardSecrecy</key>
            <false/>
            <key>NSExceptionMinimumTLSVersion</key>
            <string>TLSv1.2</string>
            <key>NSIncludesSubdomains</key>
            <false/>
            <key>NSExceptionAllowsInsecureHTTPLoads</key>
            <false/>
        </dict>
    </dict>
</dict>
```

## 2. Nom affiché sous l'icône

```xml
<key>CFBundleDisplayName</key>
<string>AutoHistorique</string>
```

## 3. Intégration de la CA privée dans le trust store de l'app

Pour qu'iOS fasse confiance à ton cert auto-signé, tu as deux options :

### Option A (la plus simple) : installer le profil de la CA

1. Envoie `ca.crt` par email ou AirDrop à l'iPhone
2. Ouvre-le sur l'iPhone → Installer
3. Réglages → Général → Concernant → Réglages de confiance des certificats
4. Active "AutoHistorique Root CA"

### Option B (embarquée dans l'app) : TrustKit

Installe via CocoaPods dans `ios/App/Podfile` :

```ruby
pod 'TrustKit'
```

Puis configure dans `ios/App/App/AppDelegate.swift` pour accepter ton cert embarqué.
Plus complexe — à voir plus tard seulement si la méthode A devient bloquante.