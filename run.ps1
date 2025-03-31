# Windows

# Caminho para o arquivo principal
$MAIN_FILE = "./main.js"

# Inputs automáticos
$START_CITY = "Arad"
$GOAL_CITY = "Craiova"

# Executa o programa com os inputs fornecidos
Write-Output "$START_CITY`n$GOAL_CITY" | node $MAIN_FILE

# Executa o script de geração de gráficos
node ./generateChart.js
