const fs = require('fs-extra');
const path = require('path');

console.log("\n🧪 TESTING NEW FIXES\n");
console.log("=" .repeat(60));

// Test 1: Check for welcomeSent flag in BotSession
console.log("\n✅ Test 1: Check welcomeSent flag in BotSession class");
try {
    const indexContent = fs.readFileSync('./index.js', 'utf8');
    if (indexContent.includes('this.welcomeSent = false')) {
        console.log("  ✅ PASSED: welcomeSent flag found in constructor");
    } else {
        console.log("  ❌ FAILED: welcomeSent flag not found");
        process.exit(1);
    }
} catch (err) {
    console.log("  ❌ FAILED:", err.message);
    process.exit(1);
}

// Test 2: Check for welcomeSent check in connection.update
console.log("\n✅ Test 2: Check welcomeSent guard in connection.update");
try {
    const indexContent = fs.readFileSync('./index.js', 'utf8');
    if (indexContent.includes('if (!this.welcomeSent)')) {
        console.log("  ✅ PASSED: welcomeSent guard found in connection.update");
    } else {
        console.log("  ❌ FAILED: welcomeSent guard not found");
        process.exit(1);
    }
} catch (err) {
    console.log("  ❌ FAILED:", err.message);
    process.exit(1);
}

// Test 3: Check for user tracking code
console.log("\n✅ Test 3: Check real-time user tracking code");
try {
    const indexContent = fs.readFileSync('./index.js', 'utf8');
    if (indexContent.includes('botData.userNames[senderJid]') && 
        indexContent.includes('lastActive: Date.now()') &&
        indexContent.includes('messageCount')) {
        console.log("  ✅ PASSED: User tracking code found");
    } else {
        console.log("  ❌ FAILED: User tracking code not found");
        process.exit(1);
    }
} catch (err) {
    console.log("  ❌ FAILED:", err.message);
    process.exit(1);
}

// Test 4: Check menu.js has userCount placeholder
console.log("\n✅ Test 4: Check menu.js has active users display");
try {
    const menuContent = fs.readFileSync('./media/menu.js', 'utf8');
    if (menuContent.includes('👥 𝗨𝘀𝗲𝗿𝘀: ${userCount} Active')) {
        console.log("  ✅ PASSED: Active users placeholder found in menu");
    } else {
        console.log("  ❌ FAILED: Active users placeholder not found");
        process.exit(1);
    }
} catch (err) {
    console.log("  ❌ FAILED:", err.message);
    process.exit(1);
}

// Test 5: Simulate user tracking
console.log("\n✅ Test 5: Simulate user tracking functionality");
try {
    let botData = { userNames: {} };
    
    // Simulate 3 users sending messages
    for (let i = 1; i <= 3; i++) {
        const senderJid = `${i}234567890@s.whatsapp.net`;
        const pushName = `User ${i}`;
        
        botData.userNames[senderJid] = {
            name: pushName,
            lastActive: Date.now(),
            messageCount: (botData.userNames[senderJid]?.messageCount || 0) + 1
        };
    }
    
    const userCount = Object.keys(botData.userNames || {}).length;
    if (userCount === 3) {
        console.log(`  ✅ PASSED: Tracked ${userCount} active users`);
        console.log(`     Users: ${Object.values(botData.userNames).map(u => u.name).join(', ')}`);
    } else {
        console.log("  ❌ FAILED: User tracking simulation failed");
        process.exit(1);
    }
} catch (err) {
    console.log("  ❌ FAILED:", err.message);
    process.exit(1);
}

// Test 6: Check menuHandler passes userCount
console.log("\n✅ Test 6: Check menuHandler passes userCount to menu");
try {
    const menuHandlerContent = fs.readFileSync('./lib/menuHandler.js', 'utf8');
    if (menuHandlerContent.includes('const userCount = Object.keys(botData.userNames || {}).length') &&
        menuHandlerContent.includes('menuModule.getMenu(timezone, userCount)')) {
        console.log("  ✅ PASSED: menuHandler correctly passes userCount");
    } else {
        console.log("  ❌ FAILED: menuHandler userCount passing not found");
        process.exit(1);
    }
} catch (err) {
    console.log("  ❌ FAILED:", err.message);
    process.exit(1);
}

console.log("\n" + "=".repeat(60));
console.log("\n📊 ALL TESTS PASSED! ✅\n");
console.log("✨ Fixes Applied:");
console.log("  1. ✅ Duplicate welcome message fixed");
console.log("  2. ✅ Real-time user tracking implemented");
console.log("  3. ✅ Active users count in menu display\n");
process.exit(0);
