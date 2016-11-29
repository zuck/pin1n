'use strict';

var assert = require('assert');
var convertToPinyin = require(__dirname + '/../app/pin1n');

describe('#convertToPinyin', function() {
  it('should return "" when an empty string is given', function() {
    assert.equal(convertToPinyin(""), "");
  });
  it("should return the same given string if it doesn't contain hanzi", function() {
    assert.equal(convertToPinyin("My name is Bob"), "My name is Bob");
  });
  it("should eliminate double spacing", function() {
    assert.equal(convertToPinyin("My name is  Bob"), "My name is Bob");
  });
  it("should trim spacing on left and right", function() {
    assert.equal(convertToPinyin(" My name is Bob  "), "My name is Bob");
  });
  it("should replace chinese punctuation symbols with western ones", function() {
    assert.equal(convertToPinyin("My name is：Bond，「James Bond」。Are you sure？Yes：James、Bond！"), "My name is: Bond, «James Bond». Are you sure? Yes: James, Bond!");
  });
  it("should replace hanzi with its pinyin", function() {
    assert.equal(convertToPinyin("我的名字是Bob"), "wǒ de míngzì shì Bob");
  });
  it("should replace traditional hanzi with its pinyin too", function() {
    assert.equal(convertToPinyin("我們的父親是Bob"), "wǒmén de fùqīn shì Bob");
  });
  it("should handle correctly sequences of spacing, hanzi and punctuation symbols", function() {
    assert.equal(convertToPinyin("我的名字是：小魚。"), "wǒ de míngzì shì: xiǎoyú.");
  });
  it("should handle correctly western punctuation symbols mixed with hanzi", function() {
    assert.equal(convertToPinyin("眾: 我們。"), "zhòng: wǒmén.");
  });
});
