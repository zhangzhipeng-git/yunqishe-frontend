<template>
    <div class="wd-input">
        <!-- 如果传入了label -->
        <template v-if="label">
            <label :for="id">{{label}}</label>
        </template>
        <br v-if="vertical"/>
        <div class="wd-input-wrap">
             <template v-if="multiple">
            <textarea :placeholder="placeholder" v-model="value$" :name="name" :id="id"></textarea>
            </template>
            <template v-else>
                <input :placeholder="placeholder" v-model="value$" :name="name" :id="id" :type="type">
            </template>
            <p v-show="showError" class="remender">{{errorText}}</p>
        </div>
    </div>
</template>
<script lang="ts" src="./input.ts"></script>
