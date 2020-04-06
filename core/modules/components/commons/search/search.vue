<template>
    <div class="wd-go-search">
        <input class="wd-go-search-input" type="text" :placeholder="placeholder"
            :vlaue="value"
            @input="emitValue"
        />
        <i class="icomoon icon-search"></i>
    </div>
</template>
<script lang="ts" src="./search.ts"></script>
